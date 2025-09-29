import marimo

__generated_with = "0.16.0"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import plotly.graph_objects as go
    from tqdm.notebook import tqdm
    import matplotlib.pyplot as plt

    import polars as pl
    import numpy as np
    import networkx as nx
    import json
    import os

    import spacy
    from bertopic import BERTopic
    from sentence_transformers import SentenceTransformer
    from sklearn.cluster import KMeans, HDBSCAN, DBSCAN
    return (
        BERTopic,
        HDBSCAN,
        KMeans,
        SentenceTransformer,
        go,
        json,
        mo,
        np,
        nx,
        os,
        pl,
        plt,
        spacy,
        tqdm,
    )


@app.cell
def _(mo):
    mo.md(text="""
    # Тематическое моделирование над пр-твом отзывов
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(
        """
    Рассмотрим пример желаемого результата, пусть нам дан следующий пример отызва:
    ```
    Сегодня решил закрыть карту и счет в данном банке. Закрыл через приложение. 

    Выбрал для вывода своих денег свой счет в другом банке. В итоге карта Газпромбанка заблокировалась, 
    а деньги с не не ушли. 

    В поддержке ничего внятного не ответили. Поехал в отделение. 

    Там мне рассказали что деньги отдать не могут потому что карта заблокирована, 
    смогут вернуть через 30 дней, причем с комиссией за перевод в другой банк, 
    хотя в приложении было написано что комиссия не взимается за данную операцию. 

    Считаю что мои средства незаконно удерживаются банком, 
    завтра попробую еще раз донести это до сотрудников отд банка и если не получитс, то бегом с заявлением в прокуратур. </p>
    ```

    Темами для данного отзыва будут:

    - Счёт
    - Карта
    - Комисия
    - тех. поддержка
    - приложение

    Но не

    - проблеммы с переводом
    - удержание средств
    """
    )
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(text="""
    # Предварительный просмотр
    """)
    return


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
        #     r'\d{1,2}.\d{1,2}.\d{1,4}', ' DATE '
        # ).str.replace_all(
        #     r'\d+', ' NUM '
        # ).str.replace_all(
            r'\s+', ' '
        ).str.strip_chars(
            r' '
        ).str.to_lowercase()
    )[:, ['clean_text', 'title', 'grade']]
    return ROOT_DATAFRAME, ROOT_DATASET


@app.cell
def _(ROOT_DATAFRAME):
    ROOT_DATAFRAME
    return


@app.cell
def _():
    # SENTENCE_TRANSFORMER_MODELS = {
    #     i: SentenceTransformer(
    #         i, default_prompt_name='document'
    #     ).to('mps') for i in (
    #         'deepvk/USER-base', "ai-forever/sbert_large_nlu_ru"
    #     )
    # }
    return


@app.cell
def _():
    return


@app.cell
def _():
    # seed_topic_list = [
    #     ["карта", "списание", "кэшбэк"],
    #     ["мошеник", "звонок"],
    #     ["вложения", "обслуживание"],
    #     ["помощь", "оператор"]
    # ]
    return


@app.cell
def _():
    # topic_modeling = BERTopic(
    #     language='russian',
    #     n_gram_range=(1, 3),
    #     embedding_model=SENTENCE_TRANSFORMER_MODELS["ai-forever/sbert_large_nlu_ru"],
    #     seed_topic_list=seed_topic_list
    # )
    return


@app.cell
def _():
    # topic_modeling.fit(ROOT_DATAFRAME['clean_text'])
    return


@app.cell
def _():
    # topic_modeling.get_topic_info()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(text="""
    # Отчищаем текст от мусорных слов
    """)
    return


@app.cell
def _(spacy):
    NLP = spacy.load('ru_core_news_md')
    return (NLP,)


@app.cell
def _(NLP):
    def progessive_word_cleaner(text: list[str], list_of_usefull_words: list[str]):
        return ' '.join(map(
            lambda a: a.lemma_,
            filter(
                lambda a: a.pos_ in list_of_usefull_words, 
                NLP(text)
            )
        ))
    return (progessive_word_cleaner,)


@app.cell
def _():
    USEFULL_WORDS_LISTS = dict(
        full_list_of_usefull_words = [
            'VERB', 
            'NOUN', 
            'ADJ', 
            'ADV'
        ],
        noun_adj_adv = [
            'NOUN', 
            'ADJ', 
            'ADV',
        ],
        only_noun = [
            'NOUN'
        ]
    )
    return (USEFULL_WORDS_LISTS,)


@app.cell
def _(USEFULL_WORDS_LISTS, mo):
    def show_mo_md_with_usefull_words_tuples():
        s = ';\n\n'.join(['- ' + ', '.join(i) for i in USEFULL_WORDS_LISTS.values()])
        return mo.md(f"""
    Рассмотрим несколько наборов часто используемых слов:

    {s}
    
    
    где 

    - `NOUN` - сущиствительное;
    - `VERB` - глагол;
    - `ADJ` - прилагательное; 
    - `ADV` - наречие

        """)
    show_mo_md_with_usefull_words_tuples()
    return


@app.cell
def _(ROOT_DATAFRAME, USEFULL_WORDS_LISTS, progessive_word_cleaner, tqdm):
    DICT_OF_CLEANED_TEXTS = dict(map(
        lambda a: (
            a[0],
            ROOT_DATAFRAME['clean_text'].map_elements(
                lambda t: progessive_word_cleaner(t, a[1])
            )
        ), 
        tqdm(USEFULL_WORDS_LISTS.items(), total=len(USEFULL_WORDS_LISTS))
    ))
    return (DICT_OF_CLEANED_TEXTS,)


@app.cell
def _(DICT_OF_CLEANED_TEXTS, USEFULL_WORDS_LISTS, mo, pl):
    mo.md(text=""""""'\n\n\n'.join([f"""
    Для набора слов: {', '.join([f'`{k}`' for k in t])}, таблица будет выглядить следующим образом:

    {mo.ui.table(pl.DataFrame(DICT_OF_CLEANED_TEXTS[i]))}
    """ for i, t in USEFULL_WORDS_LISTS.items()]))
    return


@app.cell
def _(DICT_OF_CLEANED_TEXTS, mo):
    d = DICT_OF_CLEANED_TEXTS['only_noun'].str.split(' ').list.explode().str.replace_all(r'[/\.,\?\(\)\*%:"\'+=-]', '').value_counts().sort('count')[-1000:]
    SLIDER_TO_WORD_COUNT_INTERVAL = mo.ui.range_slider(start=0, stop=d.shape[0], show_value=True, full_width=True, value=(d.shape[0]-200, d.shape[0]), )
    return SLIDER_TO_WORD_COUNT_INTERVAL, d


@app.cell
def _(SLIDER_TO_WORD_COUNT_INTERVAL, d, go, mo):
    mo.md(text=f"""
    Для случая когда используются только существительные, выведим барплот по числу слов:
    {SLIDER_TO_WORD_COUNT_INTERVAL}

    {
        mo.ui.plotly(
            go.Figure().add_trace(
                go.Bar(x=d[SLIDER_TO_WORD_COUNT_INTERVAL.value[0]:SLIDER_TO_WORD_COUNT_INTERVAL.value[1], 'clean_text'], y=d[SLIDER_TO_WORD_COUNT_INTERVAL.value[0]:SLIDER_TO_WORD_COUNT_INTERVAL.value[1], 'count'])
            )
        )
    }
    """)
    return


@app.cell
def _():
    # topic_modeling_on_cleaned_texts = BERTopic(
    #     language='russian',
    #     n_gram_range=(1, 3),
    #     embedding_model=SENTENCE_TRANSFORMER_MODELS["ai-forever/sbert_large_nlu_ru"],
    #     seed_topic_list=seed_topic_list
    # )
    # topic_modeling_on_cleaned_texts.fit(CLEANED_TEXTS)e
    # topic_modeling_on_cleaned_texts.get_topic_info()
    return


@app.cell
def _():
    # topic_modeling_on_DESC_ONLY = BERTopic(
    #     language='russian',
    #     # n_gram_range=(1, 3),
    #     embedding_model=SENTENCE_TRANSFORMER_MODELS["ai-forever/sbert_large_nlu_ru"],
    #     seed_topic_list=seed_topic_list
    # )
    # topic_modeling_on_DESC_ONLY.fit(CLEANED_TEXTS_DESC_ONLY)
    # topic_modeling_on_DESC_ONLY.get_topic_info()
    return


@app.cell
def _(mo):
    mo.md("""# Тематическое моделирование""")
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
    return (
        LIST_OF_SENTENCE_TRANSFORMER_MODEL_NAMES,
        SENTENCE_TRANSFORMER_MODELS,
    )


@app.cell
def _(HDBSCAN, KMeans):
    CLUSTERIZATOR_MODELS = {
        f'KMeans__nc={nc}': KMeans(n_clusters=nc)
        for nc in [6, 8, 10, 15, 18]
    } | {
        f'HDBSCAN_eps={"%.2f" % eps}': HDBSCAN(cluster_selection_epsilon=eps)
        for eps in [0, 0.03, 0.05]
    }
    LIST_OF_CLUSTERIZATOR_MODEL_NAMES = list(CLUSTERIZATOR_MODELS.keys())
    return CLUSTERIZATOR_MODELS, LIST_OF_CLUSTERIZATOR_MODEL_NAMES


@app.cell
def _(
    LIST_OF_CLUSTERIZATOR_MODEL_NAMES,
    LIST_OF_SENTENCE_TRANSFORMER_MODEL_NAMES,
    mo,
):
    def show_mo_md_text_to_describe_topic_modeling_experements():
        s0 = ';\n\n'.join(map(lambda a: f'- {a}', LIST_OF_SENTENCE_TRANSFORMER_MODEL_NAMES))
        s1 = ';\n\n'.join(map(lambda a: f'- {a}', LIST_OF_CLUSTERIZATOR_MODEL_NAMES))
        return mo.md(
    f"""
    В данном сегменте будет рассмотренна два подхода к тематическому моделированию:

    - Когда документ имеет множество тем
    - Когда документ имеет одну тему


    В добавок рассмотрим как другие методы кластеризации будут проявлять себя, рассмотрим:

    {s1}

    Так же, в процессе моделирования будут выбираться модели текстовых эмбедингов, будут рассмотренны:

    {s0}
    """
         )

    show_mo_md_text_to_describe_topic_modeling_experements()
    return


@app.cell
def _(BERTopic, CLUSTERIZATOR_MODELS, SENTENCE_TRANSFORMER_MODELS, tqdm):
    def bert_topic_experement(data):
        experements_res = list()
    
        for cm_name, cm_model in tqdm(CLUSTERIZATOR_MODELS.items(), total=len(CLUSTERIZATOR_MODELS)):
            for em_name, em_model in SENTENCE_TRANSFORMER_MODELS.items():
                experements_res.append(
                    dict(
                        embedding_model=em_name,
                        clusterizator=cm_name,
                        bertopic_model = BERTopic(
                            language='russian',
                            embedding_model=em_model,
                            hdbscan_model=cm_model
                        ).fit(data)
                    )
                )
        return experements_res

    return (bert_topic_experement,)


@app.cell
def _(mo):
    mo.md(text="""## Один документ много топиков""")
    return


@app.cell
def _(DICT_OF_CLEANED_TEXTS, bert_topic_experement):
    ONE_DOC_MANY_THEMES_BERTOPIC_EXPEREMENTS = bert_topic_experement(data=DICT_OF_CLEANED_TEXTS['only_noun'])
    return (ONE_DOC_MANY_THEMES_BERTOPIC_EXPEREMENTS,)


@app.cell
def _(ONE_DOC_MANY_THEMES_BERTOPIC_EXPEREMENTS, mo):
    mo.md('\n\n'.join([
    f'''
    **Result for:**

    - clusterizator = {i['clusterizator']}
    - embedding_mode = {i['embedding_model']}
    {mo.ui.table(i['bertopic_model'].get_topic_info())}
    '''
        for i in ONE_DOC_MANY_THEMES_BERTOPIC_EXPEREMENTS
    ]))
    return


@app.cell
def _(DICT_OF_CLEANED_TEXTS, bert_topic_experement):
    ONE_DOC_MANY_THEMES_BERTOPIC_EXPEREMENTS_FULL_SENTENCE = bert_topic_experement(data=DICT_OF_CLEANED_TEXTS['full_list_of_usefull_words'])
    return (ONE_DOC_MANY_THEMES_BERTOPIC_EXPEREMENTS_FULL_SENTENCE,)


@app.cell
def _(ONE_DOC_MANY_THEMES_BERTOPIC_EXPEREMENTS_FULL_SENTENCE, mo):
    mo.md('\n\n'.join([
    f'''
    **Result for:**

    - clusterizator = {i['clusterizator']}
    - embedding_mode = {i['embedding_model']}
    {mo.ui.table(i['bertopic_model'].get_topic_info()[:20])}
    '''
        for i in ONE_DOC_MANY_THEMES_BERTOPIC_EXPEREMENTS_FULL_SENTENCE if 'KMean' in i['clusterizator']
    ]))
    return


@app.cell
def _(mo):
    mo.md(text="""## Полное разбиение""")
    return


@app.cell
def _(mo):
    mo.md(text="""
    В данном разделе рассматривается подход, через разбиение на атомарные высказывания
    """)
    return


@app.cell
def _(mo):
    mo.md("""### Объяснение подхода""")
    return


@app.cell
def _(NLP, np):
    def create_dependency_matrix(text):
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
            if ti == root_word:
                for j in range(dep_labels_matrix_conj_root_delete.shape[0]):
                    # print(j, tokens_clean[j], end='\t')
                    if dep_labels_matrix_conj_root_delete[i][j] == 'conj':
                        adj_matrix_conj_root_delete[i][j] = 0
                        dep_labels_matrix_conj_root_delete[i][j] = '' 
                k += 1
        return (
            adj_matrix, dep_labels_matrix, tokens, 
            adj_matrix_clean, dep_labels_matrix_clean, tokens_clean, 
            adj_matrix_conj_root_delete, dep_labels_matrix_conj_root_delete,
            root_word
        )
    return (create_dependency_matrix,)


@app.cell
def _(nx, plt):
    def plot_tree_graph(adj_matrix, dep_labels_matrix, tokens, title):
        G = nx.from_numpy_array(adj_matrix)
        for u, v in G.edges():
            G[u][v]['dependencies'] = dep_labels_matrix[u][v]
        pos = nx.spring_layout(G) 
        fig, ax = plt.subplots(figsize=(12, 12))
        edge_labels = nx.get_edge_attributes(G, 'dependencies')
        nx.draw(G, pos, ax=ax, labels=dict(enumerate(tokens)), node_color='lightblue', 
                node_size=400, font_size=8, font_weight='bold',
                edge_color='gray', width=2, arrows=True, arrowsize=500)
        nx.draw_networkx_edge_labels(G, pos, ax=ax, font_size=8, edge_labels=edge_labels, font_color='red')
        ax.set_title(title)
        return fig
    return (plot_tree_graph,)


@app.cell
def _(ROOT_DATAFRAME, create_dependency_matrix):
    example_text = ROOT_DATAFRAME[0, 'clean_text'].split('. ')[4]
    (
        adj_matrix, dep_labels_matrix, tokens, 
        adj_matrix_clean, dep_labels_matrix_clean, tokens_clean, 
        adj_matrix_conj_root_delete, dep_labels_matrix_conj_root_delete,
        example_root_word
    ) = create_dependency_matrix(example_text)
    return (
        adj_matrix,
        adj_matrix_clean,
        adj_matrix_conj_root_delete,
        dep_labels_matrix,
        dep_labels_matrix_clean,
        dep_labels_matrix_conj_root_delete,
        example_root_word,
        example_text,
        tokens,
        tokens_clean,
    )


@app.cell
def _(example_text, mo):
    mo.md(f"""Рассмотрим построения графа связности токенов на одном предложении из отзыва (если рассматривать весь отзыв то получиться лес): \n\n*\"{example_text}\"*""")
    return


@app.cell
def _(adj_matrix, dep_labels_matrix, mo, plot_tree_graph, tokens):
    mo.mpl.interactive(plot_tree_graph(adj_matrix=adj_matrix, dep_labels_matrix=dep_labels_matrix, tokens=tokens, title="Граф связности")
    )
    return


@app.cell
def _(
    adj_matrix_clean,
    dep_labels_matrix_clean,
    mo,
    plot_tree_graph,
    tokens_clean,
):
    mo.mpl.interactive(plot_tree_graph(adj_matrix=adj_matrix_clean,dep_labels_matrix=dep_labels_matrix_clean,tokens=tokens_clean, title="Граф связности, но удалён весь муссор, в виде\nпредлогов, союзов, пунктуации и т.д."))
    
    return


@app.cell
def _(example_root_word, mo):
    mo.md(f"""Для данного графа рутом является слово: {example_root_word}. При удалении "слабых" рёбер (рёбра показывающие связь через предлог), смежных корню, из графа получаем 5 деревье, с 5-ю темами в предложении""")
    return


@app.cell
def _(
    adj_matrix_conj_root_delete,
    dep_labels_matrix_conj_root_delete,
    mo,
    plot_tree_graph,
    tokens_clean,
):
    mo.mpl.interactive(plot_tree_graph(adj_matrix=adj_matrix_conj_root_delete,dep_labels_matrix=dep_labels_matrix_conj_root_delete,tokens=tokens_clean, title="Граф связности, с разделением на деревья"))
    
    return


@app.cell
def _(mo):
    mo.md("""### Другие примеры""")
    return


@app.cell
def _(ROOT_DATAFRAME, create_dependency_matrix, mo, plot_tree_graph):
    def random_experement():
        exp_text = '. '.join(ROOT_DATAFRAME['clean_text'].shuffle()[0].split('. ')[:3])
        (
            adj_matrix, dep_labels_matrix, tokens, 
            adj_matrix_clean, dep_labels_matrix_clean, tokens_clean, 
            adj_matrix_conj_root_delete, dep_labels_matrix_conj_root_delete,
            example_root_word
        ) = create_dependency_matrix(exp_text)
        return mo.md(rf""" 

        {exp_text}

        {
            mo.as_html(plot_tree_graph(
                adj_matrix=adj_matrix_conj_root_delete,
                dep_labels_matrix=dep_labels_matrix_conj_root_delete,
                tokens=tokens_clean, title="Example"
            ))
        }

        """)
    return (random_experement,)


@app.cell
def _(random_experement):
    random_experement()
    return


@app.cell
def _(random_experement):
    random_experement()
    return


@app.cell
def _(random_experement):
    random_experement()
    return


@app.cell
def _(mo):
    mo.md(text="### Реализация подхода")
    return


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
                # print(j, tokens_clean[j], end='\t')
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
    from collections import deque

    def get_tree_tuples(adj_matrix, nodetitle):
        n = len(adj_matrix)
        visited = [False] * n
        tree_tuples = []
    
        def bfs_component(start_node):
            """Get all connected nodes using BFS"""
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
def _(correct_creation_dependency_matrix, get_tree_tuples):
    def get_themes(text):
        a = correct_creation_dependency_matrix(text)
        return get_tree_tuples(a[1], a[0])
    return (get_themes,)


@app.cell
def _(ROOT_DATASET, pl):
    TD_1 = pl.DataFrame(
        ROOT_DATASET
    ).with_columns(
        clean_text=pl.col('text').str.replace_all(
            r'</?\w+>', ' '
        # ).str.replace_all(
        #     r'\d{1,2}.\d{1,2}.\d{1,4}', ' DATE '
        ).str.replace_all(
            r'\d+', ' NUM '
        ).str.replace_all(
            r'\s+', ' '
        ).str.strip_chars(
            r' '
        ).str.to_lowercase()
    )[:, ['id', 'clean_text']]
    return (TD_1,)


@app.cell
def _(TD_1, pl):
    td1 = TD_1.sample(fraction=1, shuffle=True, seed=42)[:2000].with_columns(clean_text=pl.col('clean_text').str.split('. ')).explode('clean_text')
    return (td1,)


@app.cell
def _(get_themes, pl, td1):
    res = td1.with_columns(
        pl.col('clean_text').map_elements(get_themes, return_dtype=pl.List(pl.String))
    ).explode('clean_text')
    res = res.filter(res['clean_text'].str.len_chars() > 0)
    return (res,)


@app.cell
def _(SENTENCE_TRANSFORMER_MODELS, res):
    res_emb = SENTENCE_TRANSFORMER_MODELS['deepvk/USER-base'].encode(res['clean_text'])
    return (res_emb,)


@app.cell
def _():
    from umap import UMAP
    from sklearn.metrics import silhouette_score
    return UMAP, silhouette_score


@app.cell
def _(UMAP, res_emb):
    umap = UMAP(n_components=2)
    res_emb_updim = umap.fit_transform(res_emb)
    return (res_emb_updim,)


@app.cell
def _(mo):
    mo.md("""Выведим метрику силуэт для определения сколько класов использовать""")
    return


@app.cell
def _(KMeans, go, res_emb_updim, silhouette_score):
    NCL = [6, 8, 10, 15, 16, 17, 18, 20]
    clusters = dict(zip(NCL, [KMeans(n_clusters=i) for i in NCL]))
    go.Figure().add_trace(go.Scatter(x=NCL, y=[silhouette_score(res_emb_updim, m.fit_predict(res_emb_updim)) for i, m in clusters.items()]))

    return (clusters,)


@app.cell
def _():
    import plotly.express as pex
    return (pex,)


@app.cell
def _(mo):
    mo.md(text="""В результате, распределение класов имеет вид:""")
    return


@app.cell
def _(clusters, pex, pl, res_emb_updim):
    pex.bar(pl.Series(clusters[15].predict(res_emb_updim)).value_counts(), x='', y='count')
    return


@app.cell
def _(res_clust):
    res_clust['clean_text'].filter(res_clust['c']==5).str.split(' ').list.explode().value_counts()
    return


@app.cell
def _(mo):
    mo.md(text="""Выведим топ популярных слов, для определения имени для топика""")
    return


@app.cell
def _(clusters, mo, pex, pl, res, res_emb_updim):
    nc_t = 16
    res_clust = res.with_columns(c=pl.Series(clusters[nc_t].predict(res_emb_updim)))
    mo.md('\n\n\n'.join([
        f"""
    **TOPIC {nci}**

    {mo.ui.plotly(
        pex.bar(
            res_clust['clean_text'].filter(res_clust['c']==nci).str.split(' ').list.explode().value_counts().sort('count')[-100:],
            x='clean_text',
            y='count'
        )
    )}
        """
        for nci in range(nc_t)
    ]))
    return (res_clust,)


if __name__ == "__main__":
    app.run()
