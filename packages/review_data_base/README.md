# База данных

## Запуск

1. Выполнить скрипт `replace_pw.sh` для подстановки переменных среды
2. Выполнить
```
dcoker compose --build -d 
```

## Переменные

- POSTGRES_DB - наименование бд;
- POSTGRES_USER - основной пользователь pg;
- POSTGRES_PASSWORD - 
- CONSUMER_PASSWORD - пароль для читателя из бд
- PRODUCER_PASSWORD - пароль для добавлятеля в бд
- ADMIN_PASSWORD - пароль для админа