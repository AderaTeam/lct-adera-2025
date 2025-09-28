import requests
import dotenv
import os
import json
from confluent_kafka import Consumer, KafkaError, Producer

from additional_types import KafkaWorkersTypes
from data_extractors import banki_ru_data_extractor, sravni_ru_data_extractor
from data_pre_extractors import banki_ru_data_pre_extractor, sravni_ru_data_pre_extractor
from is_evaluate_limit_checkers import is_evaluate_limit_checkers_for_banki_ru, is_evaluate_limit_checkers_for_sravni_ru


dotenv.load_dotenv()


PARSER_CONFIG_PATH = str(os.getenv("CONFIG_PATH"))
ENCODING_SYSTEM = 'utf-8'

with open(PARSER_CONFIG_PATH) as f:
    CONFIGS = json.load(f)

TIME_SLEEP_BETWEEN_TRYING_REQUEST = CONFIGS["time_sleeps"]["time_sleep_between_trying_request"]
TIME_SLEEP_AFTER_HEADER_CHANGE = CONFIGS["time_sleeps"]["time_sleep_after_header_change"]
TIME_SLEEP_AFTER_BAN = CONFIGS["time_sleeps"]["time_sleep_after_ban"]

POISON_PILL_FLAG=CONFIGS["poison_pill_flag"]

AVAILABLE_USER_AGENTS = CONFIGS["parser_configs"]["available_user_agents"]


SESSION_FOR_LISTS = requests.Session()


KAFKA_WORKERS_DICT = dict() 

for i in CONFIGS["kafka_workers"]:
    if i["worker_type"] == KafkaWorkersTypes.consumer.value:
        KAFKA_WORKERS_DICT[i["name"]] = Consumer(i['config']) 
        KAFKA_WORKERS_DICT[i["name"]].subscribe(i["subscribes"])
    else: 
        KAFKA_WORKERS_DICT[i["name"]] = Producer(i['config'])


SITE_DATA_EXTRACTOR = {
    "banki.ru": banki_ru_data_extractor,
    "sravni.ru": sravni_ru_data_extractor
}

DATA_PRE_EXTRACTOR = {
    "banki.ru": banki_ru_data_pre_extractor,
    "sravni.ru": sravni_ru_data_pre_extractor
}

IS_EVALUATE_LIMITS_CHECKER_DICT = {
    "banki.ru": is_evaluate_limit_checkers_for_banki_ru,
    "sravni.ru": is_evaluate_limit_checkers_for_sravni_ru
}






# CONSUMER_FOR_LIST_OF_REVIEWS.subscribe([COLLECTED_LISTS_OF_REVIEW])

# CONSUMER_FOR_REVIEWS = Consumer({
#     'bootstrap.servers': 'localhost:9092',
#     'group.id': 'python-consumer-group',
#     'auto.offset.reset': 'earliest' 
# })

# CONSUMER_FOR_REVIEWS.subscribe([COLLECTED_REVIEWS])
# SESSION_FOR_FULL_TEXT = requests.Session()