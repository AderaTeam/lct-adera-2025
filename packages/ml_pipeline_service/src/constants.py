import json
from sentence_transformers import SentenceTransformer
import spacy
import punq
import dotenv
import os
from catboost import CatBoostClassifier


dotenv.load_dotenv()

SENTENCE_TRANSFORMER_MODEL_NAME=str(os.getenv('SENTENCE_TRANSFORMER_MODEL_NAME'))
SENTENCE_PROCESSOR_NAME=str(os.getenv('SENTENCE_PROCESSOR_NAME'))
DEVICE=str(os.getenv('DEVICE'))
CONFIG_PATH=str(os.getenv('CONFIG_PATH'))
with open(CONFIG_PATH) as f:
    CONFIGS = json.load(f)
PRESELECTED_TOPICS = CONFIGS['preselected_topics']
BATCH_SIZE=int(os.getenv('BATCH_SIZE'))
NLP = spacy.load(SENTENCE_PROCESSOR_NAME, exclude=[])
SENTENCE_TRANSFORMER_MODELT = SentenceTransformer(SENTENCE_TRANSFORMER_MODEL_NAME, device=DEVICE)
SENTIMENT_MODEL_PATH=str(os.getenv('SENTIMENT_MODEL_PATH'))
SENTIMENT_MODEL=CatBoostClassifier().load_model(SENTIMENT_MODEL_PATH)
LOW_PROPABILITY_LIMIT=float(os.getenv('LOW_PROPABILITY_LIMIT'))