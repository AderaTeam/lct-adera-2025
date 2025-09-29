-- Создание таблицы отзывов в 3НФ
CREATE TABLE IF NOT EXISTS sources (
    source_id SERIAL PRIMARY KEY,
    source_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cities (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    review_title VARCHAR(500) NOT NULL,
    review_text TEXT NOT NULL,
    rating INTEGER,
    review_date DATE,
    city_id INTEGER REFERENCES cities(city_id),
    source_id INTEGER REFERENCES sources(source_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topics (
    topic_id SERIAL PRIMARY KEY,
    topic_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS review_topics (
    review_topic_id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(review_id) ON DELETE CASCADE,
    topic_id INTEGER REFERENCES topics(topic_id),
    topic_mood VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(review_id, topic_id)
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(review_date);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_city ON reviews(city_id);
CREATE INDEX IF NOT EXISTS idx_reviews_source ON reviews(source_id);
CREATE INDEX IF NOT EXISTS idx_review_topics_review ON review_topics(review_id);
CREATE INDEX IF NOT EXISTS idx_review_topics_topic ON review_topics(topic_id);

-- Создание пользователей с паролями из переменных (заполняются через sed)
CREATE USER consumer WITH PASSWORD '${CONSUMER_PASSWORD}';
CREATE USER producer WITH PASSWORD '${PRODUCER_PASSWORD}';
CREATE USER admin WITH PASSWORD '${ADMIN_PASSWORD}';

-- Назначение прав пользователю Consumer (только SELECT)
GRANT CONNECT ON DATABASE postgres TO consumer;
GRANT USAGE ON SCHEMA public TO consumer;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO consumer;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO consumer;

-- Назначение прав пользователю Producer (SELECT, INSERT, UPDATE)
GRANT CONNECT ON DATABASE postgres TO producer;
GRANT USAGE ON SCHEMA public TO producer;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO producer;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO producer;

-- Назначение прав пользователю Admin (все права)
GRANT CONNECT ON DATABASE postgres TO admin;
GRANT ALL PRIVILEGES ON DATABASE postgres TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;
