from enum import Enum


class KafkaWorkersTypes(str, Enum):
    consumer="consumer"
    producer="producer"


class ParsersTypes(str, Enum):
    scraber="scraber"

class DataSettersTypes(str, Enum):
    post_gres_agregator="PostGressAgregator"