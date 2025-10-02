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
        mo,
        np,
        pex,
        pl,
        train_test_split,
    )


@app.cell
def _(mo):
    EMBEDDINGS_MODEL_NAMES = [
        "deepvk/USER-base",
        "ai-forever/sbert_large_nlu_ru",
    ]
    mo.md('Были рассмотренны следующие модели эмбедингов\n\n' + '\n'.join(f"- {i}" for i in EMBEDDINGS_MODEL_NAMES))
    return (EMBEDDINGS_MODEL_NAMES,)


@app.cell
def _(EMBEDDINGS_MODEL_NAMES, SentenceTransformer):
    def sentence_transformers_vectorizer(texts, model: SentenceTransformer):
        return model.encode(texts, normalize_embeddings=True, prompt_name='document', convert_to_numpy=True)

    SENTENCE_TRANSFORMERS_MODELS_DICT = dict(zip(EMBEDDINGS_MODEL_NAMES, map(SentenceTransformer, EMBEDDINGS_MODEL_NAMES)))

    return SENTENCE_TRANSFORMERS_MODELS_DICT, sentence_transformers_vectorizer


@app.cell
def _(mo):
    mo.md('Возмём эвристику, что рэйтинг=довольство продукта')
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
def _(mo):
    mo.md('Ка видно из столбчатой диаграмы, есть силный дисбаланс в недовольство')
    return


@app.cell
def _(mo):
    mo.md('# **Решение проблеммы дисбаланса**')
    return


@app.cell
def _(mo):
    mo.md(r"""Для сохранения распределения воспользуемся stratify'нутым разбиением на выборки""")
    return


@app.cell
def _(USEFULL_DATA, train_test_split):
    X, Y = USEFULL_DATA['text'], USEFULL_DATA['grade']
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, stratify=Y)
    return X_test, X_train, Y_test, Y_train


@app.cell
def _(
    SENTENCE_TRANSFORMERS_MODELS_DICT,
    X_test,
    X_train,
    sentence_transformers_vectorizer,
):
    VECTORIZED_X_train = {
        i: sentence_transformers_vectorizer(model=m,texts=X_train) for i, m in SENTENCE_TRANSFORMERS_MODELS_DICT.items()
    }

    VECTORIZED_X_test = {
        i: sentence_transformers_vectorizer(model=m,texts=X_test) for i, m in SENTENCE_TRANSFORMERS_MODELS_DICT.items()
    }

    return VECTORIZED_X_test, VECTORIZED_X_train


@app.cell
def _(mo):
    mo.md(r"""Рассмотрим несколько способов сбалансировать выборку""")
    return


@app.cell
def _():
    from imblearn.under_sampling import CondensedNearestNeighbour, RandomUnderSampler
    from imblearn.over_sampling import SMOTE, RandomOverSampler
    return CondensedNearestNeighbour, SMOTE


@app.cell
def _():
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots
    return go, make_subplots


@app.cell
def _(
    CondensedNearestNeighbour,
    EMBEDDINGS_MODEL_NAMES,
    SMOTE,
    VECTORIZED_X_train,
    Y_train,
    go,
    make_subplots,
    mo,
    pl,
):
    def generate_resamples():
        resampings = dict()
        figs = [
            make_subplots(
                cols=1, 
                rows=4, 
                subplot_titles=[
                    'Down-сэмплинг',
                    'Down-Up-сэмплинг',
                    'Up-сэмплинг',
                    'Source'
                ],
                vertical_spacing=0.1,
            ).update_layout(height=1800) for _ in EMBEDDINGS_MODEL_NAMES
        ]
        for k, i in enumerate(EMBEDDINGS_MODEL_NAMES):
            X_up, Y_up = SMOTE(sampling_strategy='not majority').fit_resample(
                VECTORIZED_X_train[i], 
                Y_train.reshape([-1, 1])
            )
            X_down, Y_down = CondensedNearestNeighbour(sampling_strategy='not minority').fit_resample(
                VECTORIZED_X_train[i], 
                Y_train.reshape([-1, 1])
            )
            X_down_up, Y_down_up = SMOTE(k_neighbors=5, sampling_strategy='all').fit_resample(
                VECTORIZED_X_train[i], 
                Y_train.reshape([-1, 1])
            )
            resampings[i] = dict(
                up=dict(X=X_up,Y=Y_up),
                down=dict(X=X_down,Y=Y_down),
                down_up=dict(X=X_down_up,Y=Y_down_up),
                source=dict(X=VECTORIZED_X_train[i], Y=Y_train.to_numpy())
            )
            figs[k] = figs[k].add_trace(
                go.Bar(
                    y = pl.Series(Y_down).value_counts()['count'],
                    x=pl.Series(Y_down).value_counts()['grade']
                ), col=1, row=1
            ).add_trace(
                go.Bar(
                    y = pl.Series(Y_down_up).value_counts()['count'],
                    x=pl.Series(Y_down_up).value_counts()['grade']
                ), col=1, row=2
            ).add_trace(
                go.Bar(
                    y = pl.Series(Y_up).value_counts()['count'],
                    x=pl.Series(Y_up).value_counts()['grade']
                ), col=1, row=3
            ).add_trace(
                go.Bar(
                    y = pl.Series(Y_train).value_counts()['count'],
                    x=pl.Series(Y_train).value_counts()['grade']
                ), col=1, row=4
            )
        return resampings, mo.hstack([
            mo.vstack([
                mo.md(f'##{n}'), 
                mo.ui.plotly(f)
            ]) for n, f in zip(EMBEDDINGS_MODEL_NAMES, figs)
        ])
        

    return (generate_resamples,)


@app.cell
def _(generate_resamples):
    RESAMPLES, BAR_RESAMP = generate_resamples()
    return BAR_RESAMP, RESAMPLES


@app.cell
def _(BAR_RESAMP):
    BAR_RESAMP
    return


@app.cell
def _(RESAMPLES):
    RESAMPLES
    return


@app.cell
def _():
    from tqdm.notebook import tqdm
    return (tqdm,)


@app.cell
def _(
    CatBoostClassifier,
    RESAMPLES,
    VECTORIZED_X_test,
    Y_test,
    classification_report,
    np,
    tqdm,
):
    def make_experements():
        results = dict()
        report = ''
        for embeder, samples in RESAMPLES.items():
            for sample_type, data in tqdm(samples.items()):
                x, y = data['X'], data['Y']
                cbm = CatBoostClassifier(metric_period=20,verbose=False).fit(x, y)
                yp = cbm.predict(VECTORIZED_X_test[embeder])
                name = f'{embeder} | {sample_type}'
                report += f'## {name}\n\n'
                report += classification_report(Y_test.to_list(), np.array(yp).reshape(-1).tolist())
                report += '\n\n'
                results[name] = cbm
        return results, report
    return (make_experements,)


@app.cell
def _(make_experements):
    RESULTS, report = make_experements()
    return RESULTS, report


@app.cell
def _(report):
    print(*(report.split('\n\n')[k] + '\n\n' + '\n\n'.join(report.split('\n\n')[k+1:k+4]) for k in range(10)))
    return


@app.cell
def _(mo, report):
    mo.md(report)
    return


@app.cell
def _(mo):
    mo.md(r"""Наиболее лучая модель оказалась у """)
    return


@app.cell
def _(RESULTS):
    RESULTS['deepvk/USER-base | down'].save_model('./cb_model')
    return


if __name__ == "__main__":
    app.run()
