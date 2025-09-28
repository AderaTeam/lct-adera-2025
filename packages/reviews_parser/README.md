# Парсер

Данный сервис служит для парсинга данных с
- [`banki.ru`](banki.ru)
- [`sravni.ru`](sravni.ru)

# Переменные


# Конфигурационные файлы
- `.env` - файл переменных среды, содержит следующие переменные:
    - `CONFIG_PATH` - путь к конфигурационному файлу
- `parser_config.json` - конфигурационный файл:
    - time_sleeps - словарь списков времени ожидания:
        - time_sleep_between_trying_request - время между неудачными попытками получить данные;
        - time_sleep_after_header_change - время ожидания после обновления заголовка;
        - time_sleep_after_ban - время ожидания после бана
    - kafka_workers - список воркеров Kafka:
        - name - имя воркера
        - worker_type - [`"consumer"` или `"producer"`] - тип воркера Kafka
        - config -  настройки воркера, см `confluent_kafka`
    - poison_pill_flag - втрока для паттерна poison pill
    - parser_configs - настройки парсеров:
        - list_of_parsers - список парсеров:
            - name - имя парсера
            - site - сайт по которому происходит парсинг
            - 
    - aggregators_configs - списк агрегаторов данных:
        - **name** - наименование агрегатора
        - **consumer** - имя консьюмера кафки
        - **aggregator_type** - тип агрегатора
        - **password** - пароль от БД
        - **user** - имя пользователя БД
        - **host** - хост БД
        - **port** - порт БД
        - **database** - база данных