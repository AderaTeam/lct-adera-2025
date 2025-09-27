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

    from sentence_transformers import SentenceTransformer
    from umap import UMAP
    import spacy
    from collections import deque
    return SentenceTransformer, deque, json, np, os, pex, pl, spacy


@app.cell
def _(spacy):
    NLP = spacy.load("ru_core_news_md", exclude=[])
    return (NLP,)


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
        ).str.replace(
            "кэшбек", "кэшбэк"
        ).str.replace(
            "c", "с"
        ).str.strip_chars(
            r' '
        ).str.to_lowercase()
    )[:, ['id', 'clean_text', 'text', 'title', 'grade']]
    # ROOT_DATAFRAME = ROOT_DATAFRAME.with_columns(
    #     pl.col('clean_text').map_elements(
    #         lambda a: ' '.join(map(
    #             lambda a: a.lemma_, 
    #             NLP(a)
    #         )),
    #         return_dtype=pl.String
    #     )
    # )
    return (ROOT_DATAFRAME,)


@app.cell
def _(deque):
    def get_tree_tuples(adj_matrix, nodetitle):
        n = len(adj_matrix)
        visited = [False] * n
        tree_tuples = []

        def bfs_component(start_node):
            component = set()
            queue = deque([start_node])
            visited[start_node] = True
    
            while queue:
                current = queue.popleft()
                component.add(nodetitle[current])
        
                # Check both directions since order doesn't matter
                for neighbor in range(n):
                    if (adj_matrix[current][neighbor] == 1 or 
                        adj_matrix[neighbor][current] == 1):
                        if not visited[neighbor]:
                            visited[neighbor] = True
                            queue.append(neighbor)
    
            return component

        for node in range(n):
            if not visited[node]:
                tree_tuple = bfs_component(node)
                if len(tree_tuple) > 2:
                    tree_tuples.append(' '.join(tree_tuple))

        return tuple(tree_tuples)

    return (get_tree_tuples,)


@app.cell
def _(NLP, np):
    def correct_creation_dependency_matrix(text):
        doc = NLP(text)
        root_word = ""
        n_tokens = len(doc)
        adj_matrix = np.zeros((n_tokens, n_tokens), dtype=int)
        dep_labels_matrix = np.full((n_tokens, n_tokens), '', dtype=object)
        tokens = [token.text for token in doc]
        for token in doc:
            if token.dep_ == "ROOT":
                root_word = token.text
            if token.head.i != token.i:
                adj_matrix[token.head.i][token.i] = 1
                dep_labels_matrix[token.head.i][token.i] = token.dep_
        k=0
        adj_matrix_clean, dep_labels_matrix_clean, tokens_clean = adj_matrix.copy(), dep_labels_matrix.copy(), list()
        for i, t in enumerate(tokens):
            if len(t) <= 3:
                adj_matrix_clean = np.delete(np.delete(adj_matrix_clean, i-k, 0), i-k, 1)
                dep_labels_matrix_clean = np.delete(np.delete(dep_labels_matrix_clean, i-k, 0), i-k, 1)
                k+=1
            else:
                tokens_clean.append(t)

        adj_matrix_conj_root_delete, dep_labels_matrix_conj_root_delete = adj_matrix_clean.copy(), dep_labels_matrix_clean.copy()
        k = 0
        for i, ti in zip(range(dep_labels_matrix_clean.shape[0]), tokens_clean):
            for j in range(dep_labels_matrix_conj_root_delete.shape[0]):
                if dep_labels_matrix_conj_root_delete[i][j] == 'conj':
                    adj_matrix_conj_root_delete[i][j] = 0
                    dep_labels_matrix_conj_root_delete[i][j] = '' 
                k += 1
        return (
            tokens_clean, adj_matrix_conj_root_delete, dep_labels_matrix_conj_root_delete, root_word
        )
    return (correct_creation_dependency_matrix,)


@app.cell
def _():
    pre_selected_topics = """потребительские кредиты
    ипотека
    автокредиты
    вклады
    дебетовые и кредитные карты
    online сервис
    страхование
    банковские сейфы
    денежные переводы
    депозитарные услуги
    инвестиции и брокерское обслуживание
    обмен валют
    погашение кредита""".split('\n')
    return (pre_selected_topics,)


@app.cell
def _(SENTENCE_TRANSFORMER_MODELS, pre_selected_topics):
    pre_selected_topics_emb = [SENTENCE_TRANSFORMER_MODELS['deepvk/USER-base'].encode(i) for i in pre_selected_topics]
    return (pre_selected_topics_emb,)


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
def _(correct_creation_dependency_matrix, get_tree_tuples):
    def get_themes(text):
        a = correct_creation_dependency_matrix(text)
        return get_tree_tuples(a[1], a[0])
    return (get_themes,)


@app.cell
def _():
    from sklearn.metrics.pairwise import cosine_similarity
    return (cosine_similarity,)


@app.cell
def _(correct_creation_dependency_matrix, test_text):
    correct_creation_dependency_matrix(test_text.split('. ')[0])[1]
    return


@app.cell
def _(SENTENCE_TRANSFORMER_MODELS, get_themes, test_text):
    test_text_splited = get_themes(test_text)
    res = list(map(SENTENCE_TRANSFORMER_MODELS['deepvk/USER-base'].encode, test_text_splited))
    return res, test_text_splited


@app.cell
def _(
    cosine_similarity,
    pex,
    pre_selected_topics,
    pre_selected_topics_emb,
    res,
    test_text_splited,
):
    pex.imshow(
        cosine_similarity(res, pre_selected_topics_emb),
        y=test_text_splited, x=pre_selected_topics
    )
    return


@app.cell
def _(cosine_similarity, pre_selected_topics_emb, res):
    list(map(
        lambda a: list(map(
            lambda b: cosine_similarity(a, b), 
            pre_selected_topics_emb
        )), 
        res
    ))
    return


@app.cell
def _(ROOT_DATAFRAME):
    test_text = ROOT_DATAFRAME[0, 'clean_text']
    return (test_text,)


if __name__ == "__main__":
    app.run()
