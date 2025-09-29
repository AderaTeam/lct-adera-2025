import marimo

__generated_with = "0.16.2"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    from sklearn.metrics.pairwise import cosine_distances
    from sentence_transformers import SentenceTransformer
    import polars as pl
    import os
    import json
    import umap
    import plotly.graph_objects as go
    return SentenceTransformer, json, os, pl


@app.cell
def _(json, os, pl):
    DATA_PATH = './hidden_data/LISTS_OF_REWIES/'
    ROOT_DATA_SET = list()
    for i in os.listdir(DATA_PATH):
        with open(DATA_PATH + i) as f:
            ROOT_DATA_SET+=json.load(f)['data']
    ROOT_DATAFRAME =pl.DataFrame(ROOT_DATA_SET)
    
    return (ROOT_DATAFRAME,)


@app.cell
def _(ROOT_DATAFRAME):
    ROOT_DATAFRAME
    return


app._unparsable_cell(
    r"""
    Дай описание следующим топикам, заполнив значения в кавычках:

    {
        \"кредиты\": \"\",
        \"денежные переводы\": \"\",
        \"инвестиции и брокерское обслуживание\": \"\",
        \"кэшбэк\": \"\",
        \"приложение газпром банка\": \"\",
        \"поддержка чат\": \"\",
        \"банковская карта\": \"\",
        \"отделение банка\": \"\",
        \"газпром бонус\": \"\"
    }
    """,
    name="_"
)


@app.cell
def _(SentenceTransformer):
    SENTANCE_TRANSFORMER = SentenceTransformer('')
    return


if __name__ == "__main__":
    app.run()
