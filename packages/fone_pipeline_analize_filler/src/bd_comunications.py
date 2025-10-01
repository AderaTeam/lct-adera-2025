import psycopg2
import polars as pl
from psycopg2.extras import RealDictCursor
from psycopg2 import sql
from psycopg2.extras import execute_batch

from constants import DB_HOST, DB_NAME, DB_USER, DB_USER_PW



def insert_missing_topics_simple(topic_dict):
    """Simple version to insert missing topics"""
    try:
        with psycopg2.connect(
            host="localhost",
            database="review_db",
            user="postgres",
            password="postgres123"
        ) as conn:
            with conn.cursor() as cursor:
                # Get existing topics
                cursor.execute(
                    "SELECT topic_name FROM topics WHERE topic_name IN %s", 
                    (tuple(topic_dict.keys()),)
                )
                existing = {row[0] for row in cursor.fetchall()}
                
                # Insert missing ones
                for topic in topic_dict.keys():
                    if topic not in existing:
                        cursor.execute(
                            "INSERT INTO topics (topic_name) VALUES (%s)",
                            (topic,)
                        )
                        print(f"Inserted: {topic}")
                
                conn.commit()
                
    except Exception as e:
        print(f"Error: {e}")


def get_reviews_without_topics_simple():
    try:
        # Подключение к БД
        conn = psycopg2.connect(
            host="localhost",
            database="review_db",
            user="postgres",
            password="postgres123"
        )
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT review_id, review_title, review_text, rating, review_date
                FROM reviews 
                WHERE NOT EXISTS (
                    SELECT 1 FROM review_topics 
                    WHERE review_topics.review_id = reviews.review_id
                )
            """)
            results = cur.fetchall()
            
            # for row in results:
            #     print(f"ID: {row['review_id']}, Заголовок: {row['review_title']}, "
            #           f"Рейтинг: {row['rating']}, Дата: {row['review_date']}")
            
            # print(f"\nВсего найдено: {len(results)} отзывов без топиков")

            
    except Exception as e:
        print(f"Ошибка: {e}")
    finally:
        if 'conn' in locals():
            conn.close()
    return pl.DataFrame(results)


def pre_init(topics):

    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_USER_PW
    )
    cur = conn.cursor()
    cur.execute("""
        INSERT IGNORE INTO topics () VALUES ('Value1', 'Value2', 'Value3');""")


def populate_review_topics_from_polars(df):
    """
    Populate review_topics table from Polars DataFrame
    
    Args:
        db_params: Dictionary with database connection parameters
        df: Polars DataFrame with columns: review_id, review_topic, review_sentiment
    """
    
    conn = None
    try:
        # Connect to the database
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_USER_PW
        )
        cur = conn.cursor()
        
        print("Starting to populate review_topics table from Polars DataFrame...")
        print(f"Processing {len(df)} records")
        
        # Step 1: Get unique topics from the DataFrame
        unique_topics = df['review_topic'].unique().to_list()
        print(f"Found {len(unique_topics)} unique topics")
        
        # Step 2: Insert or get topic_id for each unique topic
        topic_mapping = {}
        for topic in unique_topics:
            insert_query = "SELECT topic_id, topic_name FROM topics WHERE topic_name=%s"
            cur.execute(insert_query, (topic,))
            r = cur.fetchone()
            topic_id = r[0]
            topic_mapping[topic] = topic_id
        
        print(f"Processed {len(topic_mapping)} topics")
        
        # Step 3: Prepare data for batch insertion
        review_topics_data = []
        valid_review_ids = set()
        
        # Get all existing review_ids for validation
        cur.execute("SELECT review_id FROM reviews")
        existing_review_ids = {row[0] for row in cur.fetchall()}
        
        # Prepare the data for insertion
        for row in df.iter_rows(named=True):
            review_id = row['review_id']
            review_topic = row['review_topic']
            review_sentiment = row['review_sentiment']
            
            # Skip if review_id doesn't exist in reviews table
            if review_id not in existing_review_ids:
                continue
                
            topic_id = topic_mapping[review_topic]
            review_topics_data.append((
                review_id, topic_id, (
                    "положительно" if  4 <= review_sentiment else 
                    "отрицательно" if review_sentiment <= 2.5 else 
                    "нейтрально"
                )
            ))
            valid_review_ids.add(review_id)
        
        print(f"Found {len(valid_review_ids)} valid review IDs out of {df['review_id'].n_unique()} total")
        print(f"Prepared {len(review_topics_data)} records for insertion")
        
        # Step 4: Batch insert into review_topics table
        if review_topics_data:
            insert_query = """
            INSERT INTO review_topics (review_id, topic_id, topic_mood) 
            VALUES (%s, %s, %s)
            ON CONFLICT (review_id, topic_id) DO UPDATE 
            SET topic_mood = EXCLUDED.topic_mood,
                created_at = CASE 
                    WHEN review_topics.topic_mood != EXCLUDED.topic_mood 
                    THEN CURRENT_TIMESTAMP 
                    ELSE review_topics.created_at 
                END
            """
            
            
            execute_batch(cur, insert_query, review_topics_data)
            inserted_count = len(review_topics_data)
        else:
            inserted_count = 0
        
        # Commit the transaction
        conn.commit()
        print(f"Successfully inserted/updated {inserted_count} review topics")
        
        # Return statistics
        return {
            'total_processed': len(df),
            'valid_reviews': len(valid_review_ids),
            'topics_processed': len(topic_mapping),
            'records_inserted': inserted_count
        }
        
    except Exception as e:
        print(f"Error: {e}")
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            cur.close()
            conn.close()


