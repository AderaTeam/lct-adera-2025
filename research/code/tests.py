import marimo

__generated_with = "0.16.0"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import spacy
    from collections import deque
    import numpy as np
    from sentence_transformers import SentenceTransformer
    import torch
    from sklearn.metrics.pairwise import cosine_similarity
    import os
    import json
    import polars as pl

    NLP = spacy.load("ru_core_news_md", exclude=[])

    ADDITIONAL_STOP_WORDS = ['банк', 'газпромбанк', "центробанк", "роспотребнадзор", "деньга", "платить", "прокуратура", "услуга", "шок", "оказывать", "минута", "линия", "согласие", "злость", "мес", "руб", "прикол", "мошенник", "выполнение", "связь", "клиент", "дата", "период", "проблема", "день", "контроль", "подход", "обслуживание", "условие", "час", "нарушение", "беспредел", "закон", "обман", "ужас", "минус", "рубль", "вопрос", "галочка", "шаг", "круг", "август", "год", "тумблер", "оформление", "кнопка", "юань", "факт", "описание", "информация", "момент", "июнь", "месяц", "рука", "график", "сумма", "купюра", "гпб", "сентябрь", "июль", "борьба", "итог", "неделя", "ошибка", "сбой", "паспорт", "инцидент", "благодарность", "безобразие", "ожидание", "сбербанк", "опыт", "время", "получение", "мина", "долг", "конверт", "подвох", "причина", "ок", "кабинет", "январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", "жертва", "сбера", "участник", "протяжение", "ссылка", "осадок", "газпром", "друг", "почтабанка", "никогда", "кого", "меня"]

    def correct_creation_dependency_matrix(text):
        doc = NLP(text)
        root_word = ""
        n_tokens = len(doc)
        adj_matrix = np.zeros((n_tokens, n_tokens), dtype=int)
        dep_labels_matrix = np.full((n_tokens, n_tokens), '', dtype=object)
        tokens = [token.lemma_ for token in doc]
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
                tree_tuple = list(filter(lambda a: a not in ADDITIONAL_STOP_WORDS, bfs_component(node)))
                if len(tree_tuple) > 2:
                    tree_tuples.append(' '.join(tree_tuple))
        return tuple(tree_tuples)


    ST = SentenceTransformer("ai-forever/sbert_large_nlu_ru", device='cpu')

    def quantize_model(model):
        model.eval()
        quantized_model = torch.quantization.quantize_dynamic(
            model, {torch.nn.Linear}, dtype=torch.qint8
        )
        return quantized_model

    # STQ = quantize_model(ST)

    pre_selected_topics = np.array(list(filter(lambda a: a[0] != '#', """потребительские кредиты
    ипотека
    # автокредиты
    вклады
    дебетовые и кредитные карты
    online сервис
    страхование
    # банковские сейфы
    денежные переводы
    # депозитарные услуги
    инвестиции и брокерское обслуживание
    обмен валют
    погашение кредита
    кэшбэк
    приложение газпром банка
    газпром плюс""".split('\n'))))

    pre_selected_topics_emb = ST.encode(pre_selected_topics)

    ROOT_DATASET_PATH = '../review_parser/DATA/BANKI_RU/LISTS_OF_REWIES/'
    ROOT_DATASET = list()
    for j in os.listdir(ROOT_DATASET_PATH):
        with open(ROOT_DATASET_PATH + j) as f:
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
            "%", "процент"
        ).str.replace(
            "c", "с"
        ).str.strip_chars(
            r' '
        ).str.to_lowercase()
    )[:, ['id', 'clean_text', 'text', 'title', 'grade']]

    TEXTS = ROOT_DATAFRAME.sample(200, shuffle=True)

    sentences_splited = list()
    sentences_splited_idx = list()
    for i, ti in enumerate(TEXTS['clean_text']):
        tokens, adj_matrix, _, _ = correct_creation_dependency_matrix(ti)
        for st in get_tree_tuples(adj_matrix, tokens):
            if st != None:
                sentences_splited.append(st)
                sentences_splited_idx.append(i)
    ste = ST.encode(sentences_splited)
    w = cosine_similarity(ste, pre_selected_topics_emb)
    r = np.array(pre_selected_topics)[w.argmax(1)]
    db = pl.DataFrame([dict(t_idx=t_idx, st=st, t=t, p=p) for t_idx, st, t, p in list(filter(lambda a: a[3] > 0.45, zip(sentences_splited_idx, sentences_splited, r, w.max(1))))])
    TEXTS_DF = pl.DataFrame(dict(texts=TEXTS['text'], t_idx=range(200)))
    TEXTS_DF.join(db, on='t_idx', how='left')
    return (ROOT_DATAFRAME,)


@app.cell
def _(ROOT_DATAFRAME):
    ROOT_DATAFRAME.write_csv('./f.csv')
    return


if __name__ == "__main__":
    app.run()
