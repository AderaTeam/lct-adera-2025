from collections import deque
import numpy as np
from constants import NLP
import polars as pl


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
        if (token.head.i != token.i) and len(token.text) >= 3 and (token.dep_ != 'conj'):
            adj_matrix[token.head.i][token.i] = 1
            dep_labels_matrix[token.head.i][token.i] = token.dep_
    return tokens, adj_matrix, dep_labels_matrix, root_word
    

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


def get_sentence_subtuples(text):
    tokens, adj_matrix, dep_labels_matrix, root_word = correct_creation_dependency_matrix(text)
    return get_tree_tuples(adj_matrix, tokens)


def clean_text_dataframe_builder(data: pl.DataFrame) -> pl.DataFrame:
    return data.with_columns(
        clean_text=pl.col('review_text').str.replace_all(
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
                "%", "процент"
            ).str.replace(
                "c", "с"
            ).str.strip_chars(
                r' '
            ).str.to_lowercase()
        )[:, ['review_id', 'clean_text', "review_text"]]


def convert_to_json(df: pl.DataFrame) -> str:
    # aggregated_df = (
    #     df.group_by(["review_id", "review_topic"])
    #     .agg(pl.col("review_sentiment").mean().alias("avg_sentiment"))
    #     .group_by("review_id")
    #     .agg([
    #         pl.col("review_topic").alias("review_topic"),
    #         pl.col("avg_sentiment").alias("review_sentiment")
    #     ])
    #     .sort("review_id")
    # )
    aggregated_df = df.group_by(["review_id", "review_topic"]).agg([
        pl.col('review_sentiment').mean(),
    ]).sort("review_id")
    return aggregated_df