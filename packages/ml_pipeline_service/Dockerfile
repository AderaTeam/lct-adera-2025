FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    POETRY_VERSION=1.7.1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install poetry
RUN pip install poetry==${POETRY_VERSION}

# Set working directory
WORKDIR /app

# Copy only poetry files first for better caching
COPY pyproject.toml poetry.lock* ./

# Configure poetry to not create virtual env (optional)
RUN poetry config virtualenvs.create false

RUN ls -al
# Install dependencies
RUN poetry install --no-interaction --no-ansi
RUN poetry run spacy download ru_core_news_md

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"]