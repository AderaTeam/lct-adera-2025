from enum import Enum
import polars as pl
import psycopg2
from psycopg2.extras import execute_batch
from typing import List, Dict, Any
import os
from datetime import datetime
import dotenv
from psycopg2.extras import execute_batch

class TABLES(str, Enum):
    cities="cities"

dotenv.load_dotenv()
# Database configuration
DB_CONFIGS = {
    'host': str(os.getenv('HOST')),
    'database': str(os.getenv('POSTGRES_DATABASE')),
    'user': str(os.getenv('POSTGRES_USER')),
    'password': str(os.getenv('POSTGRES_PASSWORD')),
    'port': int(os.getenv('PORT'))
}

DB_CONNECTION = psycopg2.connect(**DB_CONFIGS)
DB_CURSOR = DB_CONNECTION.cursor()


if str(os.getenv('CLEAN_PREVIOUS_DATA')) == 'True':
    DB_CURSOR.execute(
        """
            DELETE FROM review_topics;
            DELETE FROM reviews;
            DELETE FROM topics;
            DELETE FROM sources;
            DELETE FROM cities;
        """
    )
    # DB_CURSOR.fetchone()

DF = pl.read_csv('./data/example_csv_res.csv')
if 'source' not in DF.columns:
    DF = DF.with_columns(pl.lit('banki.ru').alias('source'))
DF = DF[:, ["id", "review_text","review_title","raiting","review_date", "source"]].unique(maintain_order=True).join(DF, on='id', how="left").with_columns(
        pl.col("topic_mood").map_elements(
            lambda a: 
                    a if type(a) is str else ( 
                    "позитивно" if  4 <= a else 
                    "негативно" if a <= 2.5 else 
                    "нейтрально"
                ),
            return_dtype=pl.String
        )
    )
if 'city_name' not in DF.columns:
    DF = DF.with_columns(pl.lit('г. Москва').alias('city_name'))
print(DF)
DF = DF.with_columns(pl.col('id') - DF['id'].min())

def fill_cities():
    db = DF[:, ['city_name']].unique().to_dicts()
    rows = list(map(lambda a: (a['city_name'],), db))
    script = """
        INSERT INTO cities (city_name) VALUES (%s) ON CONFLICT DO NOTHING
    """
    execute_batch(
        DB_CURSOR, 
        script, 
        rows
    )


def fill_sources():
    db = DF[:, ['source']].unique().to_dicts()
    rows = list(map(lambda a: (a['source'],), db))
    script = """
        INSERT INTO sources (source_name) VALUES (%s) ON CONFLICT DO NOTHING
    """
    execute_batch(
        DB_CURSOR, 
        script, 
        rows
    )


def fill_topics():
    db = DF[:, ['topic_name']].unique().to_dicts()
    rows = list(map(lambda a: (a['topic_name'],), db))
    script = """
        INSERT INTO topics (topic_name) VALUES (%s) ON CONFLICT DO NOTHING
    """
    execute_batch(
        DB_CURSOR, 
        script, 
        rows
    )


def fill_reviews():
    script = """
        INSERT INTO reviews (review_id, review_title, review_text, rating, review_date, city_id, source_id) 
        VALUES (%s, %s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING
    """
    db = DF[:, ['id', 'review_text', "raiting", "review_date", "city_name", "review_title", "source"]].unique()
    DB_CURSOR.execute("SELECT city_name, city_id FROM cities")
    cities = dict(DB_CURSOR.fetchall())
    DB_CURSOR.execute("SELECT source_name, source_id FROM sources")
    sources = dict(DB_CURSOR.fetchall())
    db = db.with_columns(
        pl.col('city_name').replace(cities).alias("city_id"),
        pl.col('source').replace(sources).alias("source_id")
    ).to_dicts()
    rows = list(map(
        lambda a: (
            a['id'],
            a['review_title'],
            a['review_text'],
            a['raiting'],
            a['review_date'],
            a['city_id'],
            a['source_id'],
        ), db))
    execute_batch(
        DB_CURSOR, 
        script, 
        rows
    )
    return DF.with_columns(
        pl.col('city_name').replace(cities).alias("city_id"),
        pl.col('source').replace(sources).alias("source_id")
    )


def fill_reviews_topics():
    script = """
        INSERT INTO review_topics (review_id, topic_id, topic_mood) 
        VALUES (%s, %s, %s) ON CONFLICT DO NOTHING
    """
    db = DF[:, ['id', 'review_text', "raiting", "topic_mood", "review_date", "city_id", "review_title", "topic_name", "source_id"]].unique()
    DB_CURSOR.execute("SELECT topic_name, topic_id FROM topics")
    topics = dict(DB_CURSOR.fetchall())
    db = db.with_columns(
        pl.col('topic_name').replace(topics).alias("topic_id"),
    ).to_dicts()
    rows = list(map(
        lambda a: (
            a['id'],
            a['topic_id'],
            a['topic_mood']
        ), db))
    execute_batch(
        DB_CURSOR, 
        script, 
        rows
    )

fill_cities()
fill_sources()
fill_topics()
DF = fill_reviews()
fill_reviews_topics()
DB_CONNECTION.commit()
