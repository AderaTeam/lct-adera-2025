import marimo

__generated_with = "0.16.0"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import plotly.graph_objects as go
    import polars as pl
    import os
    import json
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
    from sklearn.feature_extraction.text import TfidfVectorizer
    import numpy as np
    from umap import UMAP
    import torch
    import spacy
    NLP = spacy.load('ru_core_news_md')
    return (
        NLP,
        SentenceTransformer,
        TfidfVectorizer,
        UMAP,
        cosine_similarity,
        go,
        json,
        mo,
        np,
        os,
        pl,
        torch,
    )


@app.cell
def _(torch):
    if torch.mps.is_available():
        DEVICE = torch.device('mps')
    elif torch.cuda.is_available():
        DEVICE = torch.device('cuda')
    else:
        DEVICE = torch.device('cpu')
    return (DEVICE,)


@app.cell
def _():
    ADDITIONAL_STOP_WORDS = ['банк', 'газпромбанк', "центробанк", "роспотребнадзор", "деньга", "платить", "прокуратура", "услуга", "шок", "оказывать", "минута", "линия", "согласие", "злость", "мес", "руб", "прикол", "мошенник", "выполнение", "связь", "клиент", "дата", "период", "проблема", "день", "контроль", "подход", "обслуживание", "условие", "час", "нарушение", "беспредел", "закон", "обман", "ужас", "минус", "рубль", "вопрос", "галочка", "шаг", "круг", "август", "год", "тумблер", "оформление", "кнопка", "юань", "факт", "описание", "информация", "момент", "июнь", "месяц", "рука", "график", "сумма", "купюра", "гпб", "сентябрь", "июль", "борьба", "итог", "неделя", "ошибка", "сбой", "паспорт", "инцидент", "благодарность", "безобразие", "ожидание", "сбербанк", "опыт", "время", "получение", "мина", "долг", "конверт", "подвох", "причина", "ок", "кабинет", "январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", "жертва", "сбера", "участник", "протяжение", "ссылка", "осадок", "газпром", "друг", "навязывание"
    ]
    return (ADDITIONAL_STOP_WORDS,)


@app.cell
def _(mo):
    mo.md(text='# **Описание классов**')
    return


@app.cell
def _(mo):
    TOPICS_DESCRIPTIONS_COMMUTATE = {
      "инвестиции и брокерское обслуживание": "Услуги по управлению капиталом, покупке и продаже ценных бумаг, доверительному управлению и инвестиционным консультациям через брокерский счёт",
      "кредиты": "Денежные займы, предоставляемые банком физическим и юридическим лицам на различных условиях и сроках",
      "денежные переводы": "Операции по переводу средств между счетами внутри банка или в другие финансовые учреждения, включая международные переводы",
      "вклады": "Депозитные продукты для сохранения и приумножения денежных средств с начислением процентов на остаток",
      "кэшбэк": "возвращающая часть потраченных средств при оплате картой в партнёрских магазинах",
      "online сервис": "Цифровые банковские услуги через интернет-банкинг и мобильное приложение для удалённого управления счетами",
      "поддержка": "Клиентский сервис банка через различные каналы связи (телефон, чат, email) для решения вопросов и консультаций",
      "дебетовые и кредитные карты": "Пластиковые и виртуальные платежные инструменты (дебетовые, кредитные) для расчётов и снятия наличных",
      "отделение банка": "Физические офисы банка для очного обслуживания клиентов и получения банковских услуг",
      "газпром плюс": "Программа лояльности ПАО «Газпром» с бонусами за покупки у партнёров, включая АЗК «Газпромнефть»",
      "автокредит": "Целевой кредит на покупку нового или подержанного автомобиля с особыми условиями для клиентов",
      "ипотека": "Долгосрочный кредит под залог недвижимости для приобретения жилья, земли или строительства",
      "страхование": "Сопутствующие услуги по страхованию жизни, здоровья, имущества, а также кредитные страховки",
      "счёт": "Банковские счета (расчётные, текущие, зарплатные) для хранения средств и проведения операций",
      "обмен валют": "Операции по покупке и продаже иностранной валюты в отделениях банка и через онлайн-сервисы"
    }

    TOPICS_DESCRIPTIONS_FULL = {
      "инвестиции и брокерское обслуживание": "Услуги по управлению капиталом, покупке и продаже ценных бумаг, доверительному управлению и инвестиционным консультациям через брокерский счёт",
      "кредиты, автокредит и ипотека": "Денежные займы, предоставляемые банком физическим и юридическим лицам на различных условиях и сроках",
      "денежные переводы": "Операции по переводу средств между счетами внутри банка или в другие финансовые учреждения, включая международные переводы",
      "вклады": "Депозитные продукты для сохранения и приумножения денежных средств с начислением процентов на остаток",
      "кэшбэк": "возвращающая часть потраченных средств при оплате картой в партнёрских магазинах",
      "online сервис": "Цифровые банковские услуги через интернет-банкинг и мобильное приложение для удалённого управления счетами",
      "поддержка": "Клиентский сервис банка через различные каналы связи (телефон, чат, email) для решения вопросов и консультаций",
      "дебетовые и кредитные карты": "Пластиковые и виртуальные платежные инструменты (дебетовые, кредитные) для расчётов и снятия наличных",
      "отделение банка": "Физические офисы банка для очного обслуживания клиентов и получения банковских услуг",
      "газпром плюс": "Программа лояльности ПАО «Газпром» с бонусами за покупки у партнёров, включая АЗК «Газпромнефть»",
      "страхование": "Сопутствующие услуги по страхованию жизни, здоровья, имущества, а также кредитные страховки",
      "счёт": "Банковские счета (расчётные, текущие, зарплатные) для хранения средств и проведения операций",
      "обмен валют": "Операции по покупке и продаже иностранной валюты в отделениях банка и через онлайн-сервисы"
    }

    mo.md(
        '\n\n'.join(
            f'**{tcn}**\n\n' + f'\n\n'.join(f'- `{tn}`\n\n\t{td}' for tn, td in tc.items()) 
            for tcn, tc in {
                'СОЕДИНЁННЫЕ ТОПИКИ': TOPICS_DESCRIPTIONS_FULL, 
                'ТОПИКИ': TOPICS_DESCRIPTIONS_FULL
            }.items()
        )
    )
    return TOPICS_DESCRIPTIONS_COMMUTATE, TOPICS_DESCRIPTIONS_FULL


@app.cell
def _(mo):
    mo.md("""# **Загрузка данных**""")
    return


@app.cell
def _(mo):
    DEFAULT_DATA_PATH = '../review_parser/DATA/BANKI_RU/LISTS_OF_REWIES/'
    PATH_TO_DATASET = mo.ui.text(value=DEFAULT_DATA_PATH, label='**Путь к датасету**', full_width=True)
    PATH_TO_DATASET
    return (PATH_TO_DATASET,)


@app.cell
def _(PATH_TO_DATASET, json, os, pl):
    ROOT_DATA_SET = list()
    if PATH_TO_DATASET.value.split('.')[-1] == 'csv':
        ROOT_DATAFRAME =pl.read_csv(PATH_TO_DATASET)
    else:
        for i in os.listdir(PATH_TO_DATASET.value):
            with open(PATH_TO_DATASET.value + i) as f:
                ROOT_DATA_SET+=json.load(f)['data']
        ROOT_DATAFRAME =pl.DataFrame(ROOT_DATA_SET)
    return (ROOT_DATAFRAME,)


@app.cell
def _(ROOT_DATAFRAME, mo):
    mo.md(text=f"""
    Представление загруженного датасета:


    {mo.ui.table(ROOT_DATAFRAME.sample(10, shuffle=True))}
    """)

    return


@app.cell
def _(mo):
    mo.md("""# **Предобработка данных**""")
    return


@app.cell
def _(mo):
    mo.md("""Для повышение качества классификации нужно привести данные к более качественному виду. Сделаем несколько итераций предобработки данных, каждую сохраним, для оценки качества""")
    return


@app.cell
def _(ADDITIONAL_STOP_WORDS, NLP, pl):
    def preclean_series_of_texts(data: pl.Series):
        return data.str.replace_all(
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
        ).str.replace(
            rf'(?i){"|".join(ADDITIONAL_STOP_WORDS)}', ' '
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


    def save_only_usefull_words(data: pl.Series):
        return data.map_elements(
        lambda a: ' '.join(map(
            lambda a: a.lemma_,
            filter(lambda a: len(a.lemma_) > 3 and a.pos_ in ['NOUN', 'ADJ', 'VERB'], 
                NLP(a)
            )
        )),
        return_dtype=pl.String)
    return preclean_series_of_texts, save_only_usefull_words


@app.cell
def _(
    ROOT_DATAFRAME,
    TOPICS_DESCRIPTIONS_COMMUTATE,
    TOPICS_DESCRIPTIONS_FULL,
    pl,
    preclean_series_of_texts,
    save_only_usefull_words,
):
    TOPICS_DESCRIPTIONS_FULL_CLEAN = preclean_series_of_texts(pl.Series([' - '.join([i, j]) for i, j in TOPICS_DESCRIPTIONS_FULL.items()]))
    TOPICS_DESCRIPTIONS_COMMUTATE_CLEAN = preclean_series_of_texts(pl.Series([' - '.join([i, j]) for i, j in TOPICS_DESCRIPTIONS_COMMUTATE.items()]))

    TOPICS_DESCRIPTIONS_FULL_ONLY_USEFULL = save_only_usefull_words(TOPICS_DESCRIPTIONS_FULL_CLEAN)
    TOPICS_DESCRIPTIONS_COMMUTATE_ONLY_USEFULL = save_only_usefull_words(TOPICS_DESCRIPTIONS_COMMUTATE_CLEAN)

    WORKING_DATAFRAME = ROOT_DATAFRAME['text'].sample(500, shuffle=True)
    ROOT_DATAFRAME_CLEAN = preclean_series_of_texts(WORKING_DATAFRAME)
    ROOT_DATAFRAME_ONLY_USEFULL = save_only_usefull_words(ROOT_DATAFRAME_CLEAN)

    PROCESSED_DATASETS_DICT = {
        'Чистый датасет': ROOT_DATAFRAME_CLEAN,
        'Датасет только из полезных слов': ROOT_DATAFRAME_ONLY_USEFULL
    }
    return (
        PROCESSED_DATASETS_DICT,
        ROOT_DATAFRAME_CLEAN,
        ROOT_DATAFRAME_ONLY_USEFULL,
        TOPICS_DESCRIPTIONS_COMMUTATE_CLEAN,
        TOPICS_DESCRIPTIONS_COMMUTATE_ONLY_USEFULL,
        TOPICS_DESCRIPTIONS_FULL_CLEAN,
        TOPICS_DESCRIPTIONS_FULL_ONLY_USEFULL,
        WORKING_DATAFRAME,
    )


@app.cell
def _(
    TOPICS_DESCRIPTIONS_COMMUTATE_CLEAN,
    TOPICS_DESCRIPTIONS_COMMUTATE_ONLY_USEFULL,
    TOPICS_DESCRIPTIONS_FULL_CLEAN,
    TOPICS_DESCRIPTIONS_FULL_ONLY_USEFULL,
):
    PROCESSED_TOPICS_DICT = {
        'Чистый датасет | Сжатые топики': TOPICS_DESCRIPTIONS_COMMUTATE_CLEAN,
        'Чистый датасет | Все топики': TOPICS_DESCRIPTIONS_FULL_CLEAN,
        'Датасет только из полезных слов | Сжатые топики': TOPICS_DESCRIPTIONS_COMMUTATE_ONLY_USEFULL,
        'Датасет только из полезных слов | Все топики': TOPICS_DESCRIPTIONS_FULL_ONLY_USEFULL
    }
    return (PROCESSED_TOPICS_DICT,)


@app.cell
def _(ROOT_DATAFRAME_CLEAN, ROOT_DATAFRAME_ONLY_USEFULL, mo, pl):
    mo.md(
        f"""
    Отобразим полученный результат:


    {mo.ui.table(
        pl.DataFrame({
            'Чистый датасет': ROOT_DATAFRAME_CLEAN,
            'Датасет только из полезных слов': ROOT_DATAFRAME_ONLY_USEFULL
        })
    )}
    """
    )
    return


@app.cell
def _(PROCESSED_DATASETS_DICT, mo):
    EMBEDDINGS_MODEL_NAMES_LIST = [
        "deepvk/USER-base",
        "ai-forever/sbert_large_nlu_ru",
    ] + [
        f'Обученный TF-IDF на {i}' for i in PROCESSED_DATASETS_DICT
    ]
    mo.md("# Использованные модели векторизации\n\n" + '\n'.join(
        f" - {i}" for i in EMBEDDINGS_MODEL_NAMES_LIST
    ))
    return (EMBEDDINGS_MODEL_NAMES_LIST,)


@app.cell
def _(
    DEVICE,
    EMBEDDINGS_MODEL_NAMES_LIST,
    PROCESSED_DATASETS_DICT,
    SentenceTransformer,
    TfidfVectorizer,
):
    SENTENCE_TRANSFORMERS_DICT = {
        mn: (
            TfidfVectorizer().fit(PROCESSED_DATASETS_DICT[mn.replace("Обученный TF-IDF на ", '')])
            if "Обученный TF-IDF на " in mn else 
            SentenceTransformer(mn, device=DEVICE, default_prompt_name='document') 
        )
        for mn in EMBEDDINGS_MODEL_NAMES_LIST
    }
    return (SENTENCE_TRANSFORMERS_DICT,)


@app.cell
def _():
    from itertools import product
    return (product,)


@app.cell
def _(EMBEDDINGS_MODEL_NAMES_LIST, PROCESSED_DATASETS_DICT, product):
    COMBINATIONS_OF_EMBEDDER_AND_DATASET = list(filter(
        lambda a: (
            a[1] == a[0].replace('Обученный TF-IDF на ', '') 
            if 'Обученный TF-IDF на ' in a[0] else
            True
        ), 
        product(EMBEDDINGS_MODEL_NAMES_LIST, PROCESSED_DATASETS_DICT, ['Сжатые топики', 'Все топики'])
    ))
    return (COMBINATIONS_OF_EMBEDDER_AND_DATASET,)


@app.cell
def _(COMBINATIONS_OF_EMBEDDER_AND_DATASET, mo):
    mo.md(
        "Выведим список рассматриваемых эксперементов\n\n" + '\n\n'.join(
            map(lambda a: ' - ' + ' $\\leftrightarrow$ '.join(a), COMBINATIONS_OF_EMBEDDER_AND_DATASET)
        )
    )
    return


@app.cell
def _(
    COMBINATIONS_OF_EMBEDDER_AND_DATASET,
    PROCESSED_DATASETS_DICT,
    PROCESSED_TOPICS_DICT,
    SENTENCE_TRANSFORMERS_DICT,
    UMAP,
):
    DICT_OF_EMBEDDINGS = {
        f'{e} | {df} | {tt}': (
            dict(
                data=SENTENCE_TRANSFORMERS_DICT[e].transform(PROCESSED_DATASETS_DICT[df]),
                topics=SENTENCE_TRANSFORMERS_DICT[e].transform(PROCESSED_TOPICS_DICT[f'{df} | {tt}'])
            )
            if 'TF-IDF' in e else
            dict(
                data=SENTENCE_TRANSFORMERS_DICT[e].encode(PROCESSED_DATASETS_DICT[df]),
                topics=SENTENCE_TRANSFORMERS_DICT[e].encode(PROCESSED_TOPICS_DICT[f'{df} | {tt}'])
            )
        )
        for e, df, tt in COMBINATIONS_OF_EMBEDDER_AND_DATASET
    }
    UMAPS_DICTS = {
        f'{n}': UMAP(3).fit(t['data'])
        for n, t in DICT_OF_EMBEDDINGS.items()
    }
    DICT_OF_EMBEDDINGS |= {
        f'{n} | UMAPED': dict(
            data=umap_i.transform(DICT_OF_EMBEDDINGS[n]['data']),
            topics=umap_i.transform(DICT_OF_EMBEDDINGS[n]['topics'])
        )
        for n, umap_i in UMAPS_DICTS.items()
    }
    return (DICT_OF_EMBEDDINGS,)


@app.cell
def _(mo):
    mo.md("""Как можно увидеть имеется слишком большая размерность, которую следует уменьшить, для этого воспользовались UMAP""")
    return


@app.cell
def _(np):
    class Review:

        def __init__(self,
            description: str,
            list_of_topics: list[str],
            topic_propabilities: list[float]
        ):
            self.description: str = description
            self.list_of_topics: str = list_of_topics
            self.topic_propabilities = topic_propabilities


        def __str__(self):
            r = '\n'.join(map(lambda a: f' - {a[0]}: {a[1]}', zip(self.list_of_topics, self.topic_propabilities)))
            l = self.description.split(' ')
            w = 5
            d = '\n'.join([' '.join(l[i:i+w]) for i in range(0, len(l) + w, w)])
            rf = '\n'.join(map(
                lambda a: f' - {a[0]}: {a[1]}', 
                filter(
                    lambda a: a[1] > np.median(self.topic_propabilities), zip(self.list_of_topics, self.topic_propabilities))))
            return f"""Review:
    {d}
    ---
    {rf}
    ---

    {r}
    """


    return (Review,)


@app.cell
def _():
    from plotly.subplots import make_subplots
    return


@app.cell
def _(np):
    def softmax(x):
        exp_x = np.exp(x.T - np.max(x, axis=1))
        return (exp_x / np.sum(exp_x.T, axis=1)).T
    return (softmax,)


@app.cell
def _(
    Review,
    TOPICS_DESCRIPTIONS_COMMUTATE,
    TOPICS_DESCRIPTIONS_FULL,
    WORKING_DATAFRAME,
    cosine_similarity,
    np,
    softmax,
):
    def experement(name, embeddings_dict, processor=softmax):
        distances = cosine_similarity(embeddings_dict['data'], embeddings_dict['topics'])
        ns = name.split(' | ')
        if len(ns) == 3:
            emb_name, dataset_name, topics = ns
        else:
            emb_name, dataset_name, topics, _ = ns
        if topics == 'Сжатые топики':
            td = TOPICS_DESCRIPTIONS_COMMUTATE
        else:
            td=TOPICS_DESCRIPTIONS_FULL
        return dict(
            name=name,
            results=[
                Review(di, topics, topic_propabilities) 
                for di, topics, topic_propabilities in zip(
                    WORKING_DATAFRAME,
                    np.array(list(td))[np.argsort(distances)[:, ::-1]],
                    np.sort(processor(distances))[:, ::-1]
                )
            ]
        )
    
    return (experement,)


@app.cell
def _(DICT_OF_EMBEDDINGS, experement):
    experements = {n: experement(n, ed) for n, ed in DICT_OF_EMBEDDINGS.items()}
    return (experements,)


@app.cell
def _(mo):
    mo.md("""# **Результаты эксперементов**""")
    return


@app.cell
def _(experements, mo):
    exp_name = mo.ui.dropdown(options=experements.keys(), label='Название эксперемента',value=next(iter(experements.keys())))
    review_idx = mo.ui.slider(start=0, stop=500, show_value=True, full_width=True,label='Индекс отзыва в эксперементе')
    return exp_name, review_idx


@app.cell
def _(exp_name, mo, review_idx):
    mo.vstack([
        exp_name,
        review_idx
    ])
    return


@app.cell
def _(exp_name, experements, go, mo, review_idx):
    r = experements[exp_name.value]['results'][review_idx.value]
    mo.vstack([
        mo.md(str(r)),
        mo.ui.plotly(
            go.Figure().add_trace(
                go.Scatter(
                    y=r.topic_propabilities, 
                    customdata=r.list_of_topics,
                    hovertemplate="""
    <b>propability:</b> %{y}<br>
    <b>topic:</b> %{customdata}<br>
    <extra></extra>
    """
                )
            )
        ),
    ])
    return


@app.cell
def _(mo):
    mo.md("""# **Суммари эксперементов**""")
    return


@app.cell
def _():
    from random import choice
    return (choice,)


@app.cell
def _(choice, experements, go, mo):
    def generate_single_report(n, res, k=10):
        fig1 = go.Figure()
        fig2 = go.Figure()
        list_of_reviews = list()
        for i in range(k):
            r = choice(res['results'])
            list_of_reviews.append(r)
            fig1 = fig1.add_trace(
                go.Scatter(
                    y=r.topic_propabilities, 
                    customdata=r.list_of_topics,
                    hovertemplate="""
    <b>propability:</b> %{y}<br>
    <b>topic:</b> %{customdata}<br>
    <extra></extra>
    """
                )
            )
            fig2 = fig2.add_trace(
                go.Scatter(
                    y=r.topic_propabilities[:-1] - r.topic_propabilities[1:], 
                    customdata=r.list_of_topics[:-1],
                    hovertemplate="""
    <b>propability:</b> %{y}<br>
    <b>topic:</b> %{customdata}<br>
    <extra></extra>
    """
                )
            )
        fig1.update_layout(title="Функции вероятности топика\nдля отзыва", )
        fig2.update_layout(title="Функции распределения топика\nдля отзыва")
        return mo.vstack([
            mo.hstack([mo.ui.plotly(fig1), mo.ui.plotly(fig2)]), mo.accordion(items={f'Review: #{i}': r.description for i, r in enumerate(list_of_reviews)})])
    
    

    mo.accordion({
        n: generate_single_report(n, res) for n, res in experements.items()
    })
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(
        r"""
    # **Выводы**

    1. Как видно из графиков, число топиков можно определить по первому перепаду функции распределения

    2. Наилучший результат у `deepvk/USER-base` + чистый текст
    """
    )
    return


if __name__ == "__main__":
    app.run()
