import marimo

__generated_with = "0.16.0"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import plotly.graph_objects as go
    import plotly.express as pex
    from tqdm.notebook import tqdm

    import polars as pl
    import numpy as np
    import json
    import os

    from sklearn.metrics import silhouette_score

    import spacy
    from keybert import KeyBERT
    from sentence_transformers import SentenceTransformer
    from umap import UMAP
    from sklearn.cluster import KMeans, HDBSCAN, DBSCAN
    return (
        KMeans,
        KeyBERT,
        SentenceTransformer,
        json,
        mo,
        np,
        os,
        pex,
        pl,
        spacy,
    )


@app.cell
def _(spacy):
    NLP = spacy.load("ru_core_news_md", exclude=["parser", "ner", "senter"])
    return (NLP,)


@app.cell
def _(NLP, json, os, pl):
    ROOT_DATASET_PATH = '../review_parser/DATA/BANKI_RU/LISTS_OF_REWIES/'
    ROOT_DATASET = list()
    for i in os.listdir(ROOT_DATASET_PATH):
        with open(ROOT_DATASET_PATH + i) as f:
            ROOT_DATASET += json.load(f)["data"]

    ROOT_DATAFRAME = pl.DataFrame(
        ROOT_DATASET
    ).with_columns(
        clean_text=pl.col('text').str.replace_all(
            r'</?\w+>', ' '
        ).str.replace_all(
            r'-?\+?\d+\.?\d*/?\s/?мес(?i)руб|руб\.|коп.', ' '
        ).str.replace_all(
            r'\d{1,2}\s*ч\.?\s*\d{1,2}\s*мин\.?\s*\d{1,4}\s*сек\.?', ' '
        ).str.replace_all(
            r'\d{1,2}:\d{1,2}:\d{1,4}', ' '
        ).str.replace_all(
            r'\d{1,2}.\d{1,2}.\d{1,4}', ' '
        ).str.replace_all(
            r'\d{1,2}.\d{1,2}', ' '
        ).str.replace_all(
            r'\d+', ' '
        ).str.replace_all(
            r'\s+', ' '
        ).str.replace(
            "кэшбек", "кэшбэк"
        ).str.replace(
            "c", "с"
        ).str.strip_chars(
            r' '
        ).str.to_lowercase()
    )[:, ['id', 'clean_text', 'text', 'title', 'grade']]
    ROOT_DATAFRAME = ROOT_DATAFRAME.with_columns(
        pl.col('clean_text').map_elements(
            lambda a: ' '.join(map(
                lambda a: a.lemma_, 
                filter(lambda a: a.pos_ == 'NOUN',NLP(a))
            )),
            return_dtype=pl.String
        )
    )
    return (ROOT_DATAFRAME,)


@app.cell
def _():
    def load_stop_words():
        with open('../DATA/stop_words.txt') as f1:
            sw = f1.read().split('\n')
        return sw


    STOP_WORDS = load_stop_words()
    return


@app.cell
def _(SentenceTransformer):
    LIST_OF_SENTENCE_TRANSFORMER_MODEL_NAMES = [
        "ai-forever/sbert_large_nlu_ru",
        'deepvk/USER-base'
    ]

    SENTENCE_TRANSFORMER_MODELS = {
        i: SentenceTransformer(i, device='mps', default_prompt_name='document')
        for i in LIST_OF_SENTENCE_TRANSFORMER_MODEL_NAMES
    }
    return (SENTENCE_TRANSFORMER_MODELS,)


@app.cell
def _(KeyBERT, SENTENCE_TRANSFORMER_MODELS):
    KW_MODEL = KeyBERT(model=SENTENCE_TRANSFORMER_MODELS['ai-forever/sbert_large_nlu_ru'])
    return (KW_MODEL,)


@app.cell
def _():
    ADDITIONAL_STOP_WORDS = ['банк', 'газпромбанк', "центробанк", "роспотребнадзор", "деньга", "платить", "прокуратура", "услуга", "шок", "оказывать", "минута", "линия", "согласие", "злость", "мес", "руб", "прикол", "мошенник", "выполнение", "связь", "клиент", "дата", "период", "проблема", "день", "контроль", "подход", "обслуживание", "условие", "час", "нарушение", "беспредел", "закон", "обман", "ужас", "минус", "рубль", "вопрос", "галочка", "шаг", "круг", "август", "год", "тумблер", "оформление", "кнопка", "юань", "факт", "описание", "информация", "момент", "июнь", "месяц", "рука", "график", "сумма", "купюра", "гпб", "сентябрь", "июль", "борьба", "итог", "неделя", "ошибка", "сбой", "паспорт", "инцидент", "благодарность", "безобразие", "ожидание", "сбербанк", "опыт", "время", "получение", "мина", "долг", "конверт", "подвох", "причина", "ок", "кабинет", "январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", "жертва", "сбера", "участник", "протяжение", "ссылка", "осадок", "газпром", "друг",
    ]

    SEMIADDITIONAL_STOP_WORDS = [
        "выдача", 
        "заявка",
        "навязывание"
        # "компетентность"
    ]
    return ADDITIONAL_STOP_WORDS, SEMIADDITIONAL_STOP_WORDS


@app.cell
def _(
    ADDITIONAL_STOP_WORDS,
    KW_MODEL,
    NLP,
    ROOT_DATAFRAME,
    SEMIADDITIONAL_STOP_WORDS,
    pl,
):
    TEST_DATAFRAME = ROOT_DATAFRAME.sample(fraction=1, shuffle=True, seed=42)[:4000]
    TEST_DATAFRAME = TEST_DATAFRAME.with_columns(kw=pl.col('clean_text').map_elements(
        lambda di: ' '.join(map(
            lambda a: a.lemma_,
            NLP(' '.join(map(
                lambda a: a[0], 
                KW_MODEL.extract_keywords(
                    di, 
                    keyphrase_ngram_range=(1,2), 
                    top_n=10, 
                    stop_words=ADDITIONAL_STOP_WORDS + SEMIADDITIONAL_STOP_WORDS
                )
            )))
        )), 
        return_dtype=pl.String
    ))
    return (TEST_DATAFRAME,)


@app.cell
def _(TEST_DATAFRAME):
    TEST_DATAFRAME
    return


@app.cell
def _():
    from bertopic import BERTopic
    return (BERTopic,)


@app.cell
def _(BERTopic, SENTENCE_TRANSFORMER_MODELS, TEST_DATAFRAME):
    def experement_hdbscan():
        bertopic_model = BERTopic(
            embedding_model=SENTENCE_TRANSFORMER_MODELS['deepvk/USER-base'],
            n_gram_range=(1, 2),
            top_n_words=3
        )
        bertopic_model.fit(TEST_DATAFRAME['kw'])
        bertopic_model.get_topic_info().to_csv('topics.csv')
        return bertopic_model.get_topic_info()
    return (experement_hdbscan,)


@app.cell
def _(BERTopic, KMeans, SENTENCE_TRANSFORMER_MODELS, TEST_DATAFRAME):
    def experement_kmeans(nc):
        bertopic_model = BERTopic(
            embedding_model=SENTENCE_TRANSFORMER_MODELS['deepvk/USER-base'],
            n_gram_range=(1, 2),
            hdbscan_model=KMeans(n_clusters=nc), 
            calculate_probabilities=True
        )
        topics, probs = bertopic_model.fit_transform(TEST_DATAFRAME['kw'])
        bertopic_model.get_topic_info().to_csv(f'topics_means_{nc}.csv')
        return bertopic_model.get_topic_info()
    return (experement_kmeans,)


@app.cell
def _():
    from itertools import product
    return (product,)


@app.function
def is_supported_hdbscan(model):
    """Check whether the input model is a supported HDBSCAN-like model."""
    try:
        import hdbscan
    except (ImportError, ModuleNotFoundError):
        hdbscan = type("hdbscan", (), {"HDBSCAN": None})()

    if isinstance(model, hdbscan.HDBSCAN):
        return True

    str_type_model = str(type(model)).lower()
    if "cuml" in str_type_model and "hdbscan" in str_type_model:
        return True

    return False


@app.cell
def _():
    from hdbscan import HDBSCAN as HDBSCAN_2
    return


@app.cell
def _(BERTopic, SENTENCE_TRANSFORMER_MODELS, TEST_DATAFRAME, np, product):
    n = list()
    lk = list(product([1], [5], [5]))
    for ngr_i, tnw_i, eps_i in lk:
        bertopic_model = BERTopic(
            embedding_model=SENTENCE_TRANSFORMER_MODELS['deepvk/USER-base'],
            n_gram_range=(1, ngr_i),
            top_n_words=tnw_i,
            calculate_probabilities=True,
        )
        l, probs = bertopic_model.fit_transform(TEST_DATAFRAME['kw'])
        log_perplexity = -1 * np.mean(np.log(np.sum(probs, axis=1)))
        perplexity = np.exp(log_perplexity)
        n.append(perplexity)
    return lk, n


@app.cell
def _(lk, n, pex):
    pex.bar(y=n, x=list(map(lambda a: f'ngr_{a[0]}__tnw_{a[1]}', lk)))
    return


@app.cell
def _(mo):
    mo.md("""# Автоматически сгенеренные топики""")
    return


@app.cell
def _(experement_hdbscan):
    experement_hdbscan()
    return


@app.cell
def _(mo):
    mo.md("""#Выбор числа топиков вручную""")
    return


@app.cell
def _(experement_kmeans):
    experement_kmeans(22)
    return


@app.cell
def _(experement_kmeans):
    experement_kmeans(1)
    return


@app.cell
def _(experement_kmeans):
    experement_kmeans(12)
    return


@app.cell
def _(experement_kmeans):
    experement_kmeans(13)
    return


@app.cell
def _(experement_kmeans):
    experement_kmeans(11)
    return


@app.cell
def _(experement_kmeans):
    experement_kmeans(15)
    return


@app.cell
def _(experement_kmeans):
    experement_kmeans(16)
    return


@app.cell
def _(experement_kmeans):
    experement_kmeans(18)
    return


@app.cell
def _(mo):
    mo.md(text="""# Если считать KW == тема""")
    return


@app.cell
def _(TEST_DATAFRAME, pex):
    pex.bar(TEST_DATAFRAME['kw'].str.split(' ').explode().value_counts().sort('count'), x='kw', y='count')
    return


@app.cell
def _(TEST_DATAFRAME):
    TEST_DATAFRAME['kw'].str.split(' ').explode().value_counts().sort('count').write_csv('topics_words_count.csv')
    return


@app.cell
def _(np, perplex):

    from sklearn.metrics.pairwise import cosine_similarity
    from sklearn.feature_extraction.text import CountVectorizer

    def calculate_bertopic_perplexity(topic_model, documents, test_documents):
        test_embeddings = topic_model.embedding_model.embed_documents(test_documents)
        topic_embeddings = topic_model.c_tf_idf_.toarray()
        similarities = cosine_similarity(test_embeddings, topic_embeddings)
        topic_probs = similarities / similarities.sum(axis=1, keepdims=True)
        vectorizer = CountVectorizer(vocabulary=topic_model.vectorizer_model.get_feature_names_out())
        doc_word_counts = vectorizer.transform(test_documents)
        log_likelihood = 0
        total_words = 0
    
        for i, doc in enumerate(test_documents):
            doc_topic_probs = topic_probs[i]
            word_counts = doc_word_counts[i]
        
            for word_idx, count in enumerate(word_counts.indices):
                word_prob = 0
                for topic_idx, topic_prob in enumerate(doc_topic_probs):
                    if word_idx < topic_embeddings.shape[1]:
                        word_prob += topic_prob * topic_embeddings[topic_idx, word_idx]
            
                if word_prob > 0:
                    log_likelihood += count * np.log(word_prob)
                total_words += count
    
        perplexity = np.exp(-log_likelihood / total_words) if total_words > 0 else float('inf')
        return perplex
    return


if __name__ == "__main__":
    app.run()
