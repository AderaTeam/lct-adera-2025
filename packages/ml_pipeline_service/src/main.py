from fastapi import FastAPI, Response
import numpy as np
import polars as pl
from src.constants import LOW_PROPABILITY_LIMIT, PRESELECTED_TOPICS, SENTIMENT_MODEL
from src.models import GetAnalizeModel
from src.scripts import clean_text_dataframe_builder, convert_to_json, correct_creation_dependency_matrix, get_sentence_subtuples, get_tree_tuples
from src.constants import SENTENCE_TRANSFORMER_MODELT
from sklearn.metrics.pairwise import cosine_similarity


PRESELECTED_TOPICS_EMBEDDINGS = SENTENCE_TRANSFORMER_MODELT.encode(
    list(map(lambda a: '. '.join(a), PRESELECTED_TOPICS.items())), 
    prompt_name='document'
)
PRESELECTED_TOPIC_NAMES_ARRAY = np.array(list(PRESELECTED_TOPICS.keys()))

app = FastAPI()


@app.get('/healthcheck')
def healthcheck():
    return 'Healthy'


@app.post('/get_analize')
def get_analize(body: GetAnalizeModel):
    num_of_reviews = len(body.data)
    root_dataframe = pl.DataFrame(body.data)
    root_dataframe_with_clean_text = clean_text_dataframe_builder(root_dataframe)
    sentences_splited = list()
    sentences_splited_idx = list()
    for i, ti in enumerate(root_dataframe_with_clean_text['clean_text']):
        tokens, adj_matrix, _, _ = correct_creation_dependency_matrix(ti)
        for st in get_tree_tuples(adj_matrix, tokens):
            if st != None:
                sentences_splited.append(st)
                sentences_splited_idx.append(root_dataframe_with_clean_text[i, 'id'])
    ste = SENTENCE_TRANSFORMER_MODELT.encode(sentences_splited)
    distances_from_topic = cosine_similarity(ste, PRESELECTED_TOPICS_EMBEDDINGS)
    selected_topics = PRESELECTED_TOPIC_NAMES_ARRAY[distances_from_topic.argmax(1)]
    sentiment_analize = SENTIMENT_MODEL.predict(ste)
    db = pl.DataFrame([
        dict(id=t_idx, topic=t, sentiment=sent, p=p) 
        for t_idx, st, t, sent, p in zip(
            sentences_splited_idx, 
            sentences_splited, 
            selected_topics, 
            sentiment_analize,
            distances_from_topic.max(1)
        )
    ])
    # texts_df = pl.DataFrame(dict(texts=, t_idx=range(num_of_reviews)))
    # texts_df_joined = root_dataframe_with_clean_text['clean_text', 'id'].join(db, on='id', how='left')
    # texts_df_joined = texts_df_joined.filter(pl.col('p') > LOW_PROPABILITY_LIMIT)
    # texts_df_joined.drop('id').group_by('t_idx').
    # r = texts_df_joined.write_csv( separator=';')
    # return Response(
    #     content=r,
    #     media_type="text/csv",
    #     headers={"Content-Disposition": "attachment; filename=data.csv"}
    # )
    return convert_to_json(db)
        


