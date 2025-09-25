import logging
from requests import get
import json
from confluent_kafka import Producer
from confluent_kafka import Consumer, KafkaError
from dotenv import load_dotenv
from threading import Thread
from time import sleep
from datetime import datetime
from random import choice

from constatnts import SESSION_FOR_FULL_TEXT, SESSION_FOR_LISTS
from requests_processors import process_get_request
from url_builders import get_url_for_list_of_review, get_url_for_review
from workflow_processors import process_consumer_response


COLLECTED_LISTS_OF_REVIEW = 'COLLECTED_LIST_OF_REVIEW'
COLLECTED_REVIEWS = 'COLLECTED_REVIEWS'

PRODUCER = Producer({
    'bootstrap.servers': 'localhost:9092',  # адреса брокеров Kafka
    'client.id': 'python-producer'
})

CONSUMER_FOR_LIST_OF_REVIEWS = Consumer({
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'python-consumer-group',
    'auto.offset.reset': 'earliest' 
})

CONSUMER_FOR_LIST_OF_REVIEWS.subscribe([COLLECTED_LISTS_OF_REVIEW])

CONSUMER_FOR_REVIEWS = Consumer({
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'python-consumer-group',
    'auto.offset.reset': 'earliest' 
})

CONSUMER_FOR_REVIEWS.subscribe([COLLECTED_REVIEWS])

END_OF_WORK = 'eow'

HEADER = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

USER_AGENTS = [
    # 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    # 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
    # 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
]

def build_header():
    # HEADER['User-Agent'] = choice(USER_AGENTS)
    return HEADER


def delivery_report(err, msg, idx=1):
        """Callback для подтверждения доставки"""
        if err is not None:
            print(f'Сообщение idx:{idx} не доставлено: {err}')

LIST_OF_REVIEW_PARSER_TIMESTEP = 10
SPLIT_LIST_OF_REVIEWS_ON_REVIEWS_TIMESTEP = 5


def get_list_of_review(*args):
    from_ = args[0]
    to_ = args[1]
    for i in range(from_+1, to_+1):
        l = get_url_for_list_of_review(i)
        value = process_get_request(SESSION_FOR_LISTS, link=l, n_repeads=3, header=build_header(), time_sleep=5)
        if value != None:
            if value.status_code == 200:
                value = value.json()
                with open(f'./DATA/BANKI_RU/LISTS_OF_REWIES/list_of_review_{i}.json', 'w') as f:
                    json.dump(value, f, ensure_ascii=False)
                if value['hasMorePages']:
                    PRODUCER.produce(
                        topic=COLLECTED_LISTS_OF_REVIEW,
                        key=f'list_of_review_{i}',
                        value=json.dumps(value).encode('utf-8'),
                        callback = lambda *a: delivery_report(a[0], a[1], i)
                    )
                    PRODUCER.poll(1.0, )
                else:
                    PRODUCER.produce(
                        topic=COLLECTED_LISTS_OF_REVIEW,
                        key=f'list_of_review_{i}',
                        value=json.dumps(value).encode('utf-8'),
                        callback = lambda *a: delivery_report(a[0], a[1], i)
                    )
                    PRODUCER.poll(1.0, )
                    break
            else:
                print(l)
        else:
            print(l)
        sleep(LIST_OF_REVIEW_PARSER_TIMESTEP)
    PRODUCER.produce(
        topic=COLLECTED_LISTS_OF_REVIEW,
        key=END_OF_WORK,
        value=END_OF_WORK,
        callback = lambda *a: delivery_report(a[0], a[1], i)
    )
    PRODUCER.poll(1.0)
    PRODUCER.flush()
    logging.info('End of work for get list of reviews')


def split_list_of_reviews_on_reviews():
    try:
        while True:
            msg = CONSUMER_FOR_LIST_OF_REVIEWS.poll(1.0) 
            process_consumer_response(msg, COLLECTED_LISTS_OF_REVIEW)
            if msg != None:
                key = msg.key().decode('utf-8') if msg.key() else None
                if key == END_OF_WORK:
                    break
                if key != None:
                    value = json.loads(msg.value().decode('utf-8'))
                    for i, ri in enumerate(value['data']):
                        try:
                            l = get_url_for_review(ri["id"])
                            r = process_get_request(SESSION_FOR_FULL_TEXT, link=l, n_repeads=3, header=HEADER, time_sleep=5)
                            ri['full_review_text'] = r.content.decode()
                        except:
                            ri['full_review_text'] = ''
                        PRODUCER.produce(
                            topic=COLLECTED_REVIEWS,
                            key=f'review_{ri["id"]}',
                            value=json.dumps(ri).encode('utf-8'),
                            callback = lambda *a: delivery_report(a[0], a[1], i)
                        )
                        PRODUCER.poll(0)
                        sleep(SPLIT_LIST_OF_REVIEWS_ON_REVIEWS_TIMESTEP)
    except KeyboardInterrupt:
        print("Прервано пользователем")
    finally:
        CONSUMER_FOR_LIST_OF_REVIEWS.close()
    
    PRODUCER.produce(
        topic=COLLECTED_LISTS_OF_REVIEW,
        key=END_OF_WORK,
        value=END_OF_WORK,
        callback = lambda *a: delivery_report(a[0], a[1], -1)
    )
    PRODUCER.poll(0)
    PRODUCER.flush()


def review_to_json():
    try:
        while True:
            msg = CONSUMER_FOR_REVIEWS.poll(1.0)
            if msg != None:
                process_consumer_response(msg, COLLECTED_REVIEWS)
                key = msg.key().decode('utf-8') if msg.key() else None
                if key == END_OF_WORK:
                    break
                if key != None:
                    value = json.loads(msg.value().decode('utf-8'))
                    with open(f'./DATA/BANKI_RU/REVIEWS/{key}__{str(datetime.now()).replace(" ", "_")}.json', 'w') as f:
                        json.dump(value, f, ensure_ascii=False)
    except KeyboardInterrupt:
        print("Прервано пользователем")
    finally:
        CONSUMER_FOR_REVIEWS.close()
    CONSUMER_FOR_REVIEWS.close()
    

if __name__ == '__main__':
    t1 = Thread(target=get_list_of_review, args=(300, 500))
    t2 = Thread(target=split_list_of_reviews_on_reviews)
    t3 = Thread(target=review_to_json)
    t1.start()
    t2.start()
    t3.start()
    t1.join()
    t2.join()
    t3.join()

