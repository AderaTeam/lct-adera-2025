
import datetime
import json
import logging
import psycopg2
from additional_types import DataSettersTypes
from constatnts import CONFIGS, KAFKA_WORKERS_DICT, POISON_PILL_FLAG, SITE_DATA_EXTRACTOR
from workflow_processors import process_consumer_response


class PostgresDataSetter:

    def __init__(self, name, consumer, pg_password, pg_user, host, port, database):
        self.consumer = consumer
        self.pg_password = pg_password
        self.pg_user = pg_user
        self.name = name
        self.host = host
        self.port = port
        self.database = database
        self.connection = psycopg2.connect(
            host=self.host,
            port=self.port,
            user=self.pg_user,
            password=self.pg_password,
            database=self.database
        )

    def __call__(self):
        while True:
            try:
                msg = self.consumer.poll(1.0) 
                process_consumer_response(msg, self.name)
                if msg != None:
                    key = msg.key().decode('utf-8') if msg.key() else None
                    if key == POISON_PILL_FLAG:
                        break
                    if key != None:
                        value = json.loads(msg.value().decode('utf-8'))
                        with self.connection.cursor() as cur:
                            cur.execute(
                                "INSERT INTO sources (source_name) VALUES (%s) ON CONFLICT (source_name) DO UPDATE SET source_name = EXCLUDED.source_name RETURNING source_id",
                                (value['site'],)
                            )
                            source_id = cur.fetchone()[0]
                            # if value['site'] == 'banki.ru':
                            #     x = value['data']['data']
                            # if value['site'] == 'sravni.ru':
                            #     x = value['data']['items']
                            for ri in value['data']:
                                item_ri = SITE_DATA_EXTRACTOR[value['site']](ri)
                                cur.execute(
                                    "INSERT INTO cities (city_name) VALUES (%s) ON CONFLICT (city_name) DO UPDATE SET city_name = EXCLUDED.city_name RETURNING city_id",
                                    (item_ri['city_name'],)
                                )
                                city_id = cur.fetchone()[0]
                                review_date = item_ri['created_at']
                                # if isinstance(review_date, str):
                                #     review_date = review_date
                                # elif isinstance(review_date, datetime):
                                #     review_date = review_date.date()
                                cur.execute(
                                    """
                                    INSERT INTO reviews (review_title, review_text, rating, review_date, city_id, source_id)
                                    VALUES (%s, %s, %s, %s, %s, %s)
                                    RETURNING review_id
                                    """,
                                    (
                                        item_ri['review_title'],
                                        item_ri['review_text'],
                                        item_ri['grade'],  # предполагаем, что grade это рейтинг 1-5
                                        review_date,
                                        city_id,
                                        source_id
                                    )
                                )
                                review_id = cur.fetchone()[0]
                        self.connection.commit()
            except Exception as e:
                self.connection.rollback()
                logging.error(f"{self.name} - Gotted error {e}")
        self.connection.close()
        logging.info("End of work")

AGGREGATORS_BUILDERS_DICT = dict(zip(DataSettersTypes, (PostgresDataSetter,)))

LIST_OF_DATA_SETTERS = []
for i in CONFIGS["aggregators_configs"]:
    LIST_OF_DATA_SETTERS.append(AGGREGATORS_BUILDERS_DICT[i["aggregator_type"]](
        name=i["name"],
        pg_password=i["password"],
        pg_user=i["user"],
        port=i["port"],
        host=i["host"],
        database=i["database"],
        consumer=KAFKA_WORKERS_DICT[i['consumer']]
    ))