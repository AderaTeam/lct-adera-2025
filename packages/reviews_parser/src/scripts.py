import logging
from random import choice
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

from constatnts import AVAILABLE_USER_AGENTS


def replace_url_param(url, param_name, new_value):
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    query_params[param_name] = [new_value]
    new_query_string = urlencode(query_params, doseq=True)
    new_url = urlunparse(parsed_url._replace(query=new_query_string))
    return new_url


def build_header(header):
    header['User-Agent'] = choice(AVAILABLE_USER_AGENTS)
    return header



def delivery_report(err, msg, idx, parser_name):
    """Callback для подтверждения доставки"""
    if err is not None:
        logging.error(f'{parser_name} - Сообщение idx:{idx} не доставлено: {err}')