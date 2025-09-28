import logging
from time import sleep
import requests
from requests import Session

from constatnts import TIME_SLEEP_BETWEEN_TRYING_REQUEST


def process_get_request(session: Session, link, n_repeads, header, time_sleep=5):
    for _ in range(n_repeads):
        try:
            res = session.get(link, headers=header)
            return res
        except Exception as e:
            logging.error(f'Cannot get link: {link}, status code:, with error {e}')
        sleep(TIME_SLEEP_BETWEEN_TRYING_REQUEST)
    