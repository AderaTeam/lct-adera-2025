import json
import logging
from time import sleep
from bs4 import BeautifulSoup
import requests

from additional_types import ParsersTypes
from constatnts import CONFIGS, DATA_PRE_EXTRACTOR, ENCODING_SYSTEM, IS_EVALUATE_LIMITS_CHECKER_DICT, KAFKA_WORKERS_DICT, TIME_SLEEP_AFTER_BAN, TIME_SLEEP_AFTER_HEADER_CHANGE, TIME_SLEEP_BETWEEN_TRYING_REQUEST
from requests_processors import process_get_request
from scripts import build_header, delivery_report, replace_url_param
from confluent_kafka import Producer


class ScrabParser:

    def __init__(self, header, name, link, site, query_value, session, producer, topic):
        self.header = header
        self.link = link
        self.query_value = query_value
        self.session = session
        self.producer = producer
        self.topic = topic
        self.site = site
        self.name = name

    def __set_data__(self, value, idx):
        self.producer.produce(
            topic=self.topic,
            key=f'{self.name}_list_of_review_{idx}',
            value=json.dumps({
                "data": DATA_PRE_EXTRACTOR[self.site](value), 
                "site": self.site
            }).encode(ENCODING_SYSTEM),
            callback = lambda *a: delivery_report(a[0], a[1], idx, parser_name=self.name)
        )
        self.producer.poll(1.0,)
    

    def __self_updater_after_ban__(self, response):
            self.header = build_header(self.header)
            logging.error(f"{self.name} - gotted exception while try scrab data: status code = {response.status_code}")
            sleep(TIME_SLEEP_AFTER_BAN)
            self.session = requests.Session()


    def __call__(self):
        idx = 1
        while True:
            url = replace_url_param(
                url=self.link,
                param_name=self.query_value,
                new_value=idx
            )
            response = process_get_request(
                self.session, 
                link=url, 
                n_repeads=3, 
                header=self.header, 
                time_sleep=TIME_SLEEP_BETWEEN_TRYING_REQUEST
            )
            if response == None:
                self.header = build_header(self.header)
                sleep(TIME_SLEEP_AFTER_HEADER_CHANGE)
                response = process_get_request(
                    self.session, 
                    link=url, 
                    n_repeads=3, 
                    header=self.header, 
                    time_sleep=TIME_SLEEP_BETWEEN_TRYING_REQUEST
                )
            if response != None:
                if response.status_code == 200:
                    value = response.json()
                    self.__set_data__(value, idx)
                    if IS_EVALUATE_LIMITS_CHECKER_DICT[self.site]:
                        self.__set_data__(value, idx)
                        self.producer.poll(1.0,)
                        logging.info(f"{self.name} - End of work")
                        break
                else:
                    self.__self_updater_after_ban__(response)
            else:
                self.__self_updater_after_ban__(response)
            idx += 1
        self.producer.flush()
        logging.info('End of work for get list of reviews')


DICT_OF_PARSERS_BUILDERS = dict(zip(ParsersTypes, (ScrabParser,)))


LIST_OF_PARSERS = []
for i in CONFIGS["parser_configs"]["list_of_parsers"]:
    LIST_OF_PARSERS.append(DICT_OF_PARSERS_BUILDERS[i["parser_type"]](
        header=i["header"],
        link=i["link"],
        query_value=i["query_value"],
        topic=i["topic"],
        session=requests.Session(),
        producer=KAFKA_WORKERS_DICT[i["producer"]],
        name=i["name"],
        site=i["site"]
    ))


def get_date_of_review(page_html):
    pass

def parse_review_page(page_html: str):
    pass