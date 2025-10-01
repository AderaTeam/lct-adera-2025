import marimo

__generated_with = "0.16.0"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import plotly.express as pex
    from sklearn.metrics import classification_report
    from time import monotonic

    import polars as pl
    import numpy as np
    from sklearn.model_selection import train_test_split

    import spacy
    from sentence_transformers import SentenceTransformer
    from catboost import CatBoostClassifier, CatBoostRegressor
    return (
        CatBoostClassifier,
        SentenceTransformer,
        classification_report,
        monotonic,
        np,
        pex,
        pl,
        spacy,
        train_test_split,
    )


@app.cell
def _(spacy):
    NLP = spacy.load("ru_core_news_md")
    return (NLP,)


@app.cell
def _():
    embeddings_models_names = [
        "deepvk/USER-base",
        "ai-forever/sbert_large_nlu_ru",
    ]
    return (embeddings_models_names,)


@app.cell
def _(NLP, SentenceTransformer, embeddings_models_names, np):
    def sentence_transformers_vectorizer(texts, model: SentenceTransformer):
        return model.encode(texts, normalize_embeddings=True, prompt_name='document', convert_to_numpy=True)


    def spacy_vectorizer(texts):
        return np.array([NLP(i).vector for i in texts])

    sentence_transformers_models = dict(zip(embeddings_models_names, map(SentenceTransformer, embeddings_models_names)))

    vectorizers = dict()
    return (
        sentence_transformers_models,
        sentence_transformers_vectorizer,
        vectorizers,
    )


@app.cell
def _(
    sentence_transformers_models,
    sentence_transformers_vectorizer,
    vectorizers,
):
    # vectorizers['spacy'] = spacy_vectorizer
    for i, j in sentence_transformers_models.items():
        vectorizers[i] = lambda t: sentence_transformers_vectorizer(t, j) 
    return


@app.cell
def _(pl):
    DATA = pl.read_csv('../DATA/full_dataset_banki_ru.csv')
    USEFULL_DATA = DATA[:, ['text', 'grade']]
    return DATA, USEFULL_DATA


@app.cell
def _(DATA, pex):
    pex.histogram(DATA['grade'])
    return


@app.cell
def _(USEFULL_DATA, train_test_split):
    X, Y = USEFULL_DATA['text'], USEFULL_DATA['grade']
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, stratify=Y)
    return X_test, X_train, Y_test, Y_train


@app.cell
def _(
    CatBoostClassifier,
    X_test,
    X_train,
    Y_test,
    Y_train,
    classification_report,
    monotonic,
    np,
):
    def make_experement(vectorizer):
        cbm = CatBoostClassifier(metric_period=20)
        t1 = monotonic()
        xv_train = vectorizer(X_train)
        t2 = monotonic()
        print(f'v time = {t2} - {t1} = {t2 - t1}')
        xv_test = vectorizer(X_test)
        cbm.fit(xv_train, Y_train.to_list())
        t1_cbm = monotonic()
        yp = cbm.predict(xv_test)
        t2_cbm = monotonic()
        print(classification_report(Y_test.to_list(), np.array(yp).reshape(-1).tolist()))
        print(f'p time = {t2_cbm} - {t1_cbm} = {t2_cbm - t1_cbm}')
        return cbm, t1, t2, t1_cbm, t2_cbm
    return (make_experement,)


@app.cell
def _(make_experement, vectorizers):
    RES = dict()
    for i_, j_ in vectorizers.items():
        print(f'->{i_}', "="*30)
        RES[i_] = make_experement(j_)
    return (RES,)


@app.cell
def _(X_test, vectorizers):
    xtestv = vectorizers['ai-forever/sbert_large_nlu_ru'](X_test)
    return (xtestv,)


@app.cell
def _(RES, X_test, Y_test, xtestv):
    idx = 3
    print(Y_test[idx])
    print(X_test[idx])
    RES['ai-forever/sbert_large_nlu_ru'][0].predict_proba(xtestv)[idx]
    return


@app.cell
def _(RES):
    RES['ai-forever/sbert_large_nlu_ru'][0].save_model('./cb_model')
    return


@app.cell
def _():
    # USEFULL_DATA.with_columns(
    #     clean_text=pl.col('text'),
    #     clean_grade=pl.col('')
    # )
    return


if __name__ == "__main__":
    app.run()
