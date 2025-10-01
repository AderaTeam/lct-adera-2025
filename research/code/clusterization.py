import marimo

__generated_with = "0.16.0"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import plotly.graph_objects as go
    from tqdm.notebook import tqdm

    import polars as pl
    import json
    from itertools import product

    import os

    from sentence_transformers import SentenceTransformer
    from umap import UMAP
    from sklearn.cluster import KMeans

    from sklearn.metrics import silhouette_score
    return (
        KMeans,
        SentenceTransformer,
        UMAP,
        go,
        json,
        os,
        pl,
        silhouette_score,
    )


@app.cell
def _(json, os, pl):
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
        ).str.strip_chars(
            r' '
        ).str.to_lowercase()
    )
    return (ROOT_DATAFRAME,)


@app.cell
def _(SentenceTransformer):
    SENTENCE_TRANSFORMER_MODELS = {
        i: SentenceTransformer(
            i, default_prompt_name='document'
        ).to('mps') for i in (
            'deepvk/USER-base', "ai-forever/sbert_large_nlu_ru"
        )
    }
    return (SENTENCE_TRANSFORMER_MODELS,)


@app.cell
def _(
    KMeans,
    ROOT_DATAFRAME,
    SENTENCE_TRANSFORMER_MODELS,
    UMAP,
    silhouette_score,
):
    num_of_clusters = range(2, 20)
    new_dim_size = range(2, 15)
    res_exp = list()
    args = (new_dim_size, num_of_clusters,)
    args_lens = list(map(len, args))
    for stm in SENTENCE_TRANSFORMER_MODELS.keys():
        res = SENTENCE_TRANSFORMER_MODELS[stm].encode(ROOT_DATAFRAME['clean_text'])
        for nds in range(2, 15):
            umap_mod = UMAP(n_components=nds)
            ures = umap_mod.fit_transform(res)
            for nc in num_of_clusters:
                clusterizer = KMeans(nc)
                res_c = clusterizer.fit_predict(ures)
                res_exp.append(dict(
                    clusterizer=clusterizer, 
                    new_dimension=nds, 
                    res=res_c, 
                    num_of_clusters=nc, 
                    silhouette_score=silhouette_score(X=res, labels=res_c), 
                    umap_mod=umap_mod, 
                    stm=stm
                ))
    
    return new_dim_size, res_exp


@app.cell
def _(go, res_exp):
    def plot_res_exp(new_dimension, stm):
        exp_cond = list(filter(lambda a: (a['new_dimension'] == new_dimension) and (a['stm'] == stm), res_exp))
        return go.Scatter(x=list(map(lambda a: a['num_of_clusters'], exp_cond)), y=list(map(lambda a: a['silhouette_score'], exp_cond)))
    return (plot_res_exp,)


@app.cell
def _(go, new_dim_size, plot_res_exp):
    fig = go.Figure()
    for ndsi in new_dim_size:
        fig.add_trace(plot_res_exp(new_dimension=ndsi, stm='deepvk/USER-base'))
    fig
    return


@app.cell
def _(go, new_dim_size, plot_res_exp):
    fig2 = go.Figure()
    for ndsi2 in new_dim_size:
        fig2.add_trace(plot_res_exp(new_dimension=ndsi2, stm='ai-forever/sbert_large_nlu_ru'))
    fig2
    return


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
