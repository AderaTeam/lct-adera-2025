from confluent_kafka import KafkaError
import logging


def process_consumer_response(msg, worker):
    if msg is None:
        return
    r = msg.error()
    if r:
        c = r.code()
        if c == KafkaError._PARTITION_EOF:
            logging.warning(f"Kafka partition end of file: {c}")
        else:
            logging.error(f"Kafka: {msg.error()} for worker {worker}")