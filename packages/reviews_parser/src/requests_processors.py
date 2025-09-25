import logging
from time import sleep
import requests
from requests import Session


def process_get_request(session: Session, link, n_repeads, header, time_sleep=5):
    for i in range(n_repeads):
        try:
            res = session.get(link, headers=header)
            return res
        except Exception as e:
            logging.error(f'Cannot get link: {link}, status code:, with error {e}')
        sleep(5)
    