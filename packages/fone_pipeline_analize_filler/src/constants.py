from optimum.onnxruntime import ORTModelForFeatureExtraction
from optimum.onnxruntime import ORTModelForFeatureExtraction
from transformers import AutoTokenizer, pipeline
import spacy
import json
import dotenv
import os
from catboost import CatBoostClassifier


dotenv.load_dotenv()

DB_HOST = str(os.getenv("DB_HOST"))
DB_PORT = str(os.getenv("DB_PORT"))
DB_NAME = str(os.getenv("DB_NAME"))
DB_USER = str(os.getenv("DB_USER"))
DB_USER_PW = str(os.getenv("DB_USER_PW"))
SENTENCE_TRANSFORMER_MODEL_NAME=str(os.getenv('SENTENCE_TRANSFORMER_MODEL_NAME'))
SENTENCE_PROCESSOR_NAME=str(os.getenv('SENTENCE_PROCESSOR_NAME'))
DEVICE=str(os.getenv('DEVICE'))
CONFIG_PATH=str(os.getenv('CONFIG_PATH'))
with open(CONFIG_PATH) as f:
    CONFIGS = json.load(f)
PRESELECTED_TOPICS = CONFIGS['preselected_topics']
BATCH_SIZE=int(os.getenv('BATCH_SIZE'))
NLP = spacy.load(SENTENCE_PROCESSOR_NAME, exclude=[])
SENTIMENT_MODEL_PATH=str(os.getenv('SENTIMENT_MODEL_PATH'))
SENTIMENT_MODEL=CatBoostClassifier().load_model(SENTIMENT_MODEL_PATH)
LOW_PROPABILITY_LIMIT=float(os.getenv('LOW_PROPABILITY_LIMIT'))
tokenizer = AutoTokenizer.from_pretrained(SENTENCE_TRANSFORMER_MODEL_NAME)
model = ORTModelForFeatureExtraction.from_pretrained(SENTENCE_TRANSFORMER_MODEL_NAME)
PIPELINE = pipeline("feature-extraction", model=model, tokenizer=tokenizer, device='cpu')
