import marimo

__generated_with = "0.16.0"
app = marimo.App(width="medium")


@app.cell
def _():
    import polars as pl
    from transformers import pipeline
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch
    import re
    import spacy
    import numpy as np
    return np, pipeline, pl, re, spacy, torch


@app.cell
def _(pipeline):
    PIPELINE = pipeline(
        "sentiment-analysis",
        model="sismetanin/rubert-ru-sentiment-rusentiment",
        tokenizer="sismetanin/rubert-ru-sentiment-rusentiment", 
        truncation=True, 
        max_length=510
    )
    return (PIPELINE,)


@app.cell
def _(spacy):
    NLP = spacy.load("ru_core_news_md")
    return (NLP,)


@app.cell
def _(pl):
    DATA = pl.read_csv('../DATA/full_dataset_banki_ru.csv')
    return (DATA,)


@app.cell
def _():
    with open('../DATA/stop_words.txt') as stop_words_file:
        stop_words = stop_words_file.read().split('\n')
    return


@app.function
def is_usefull_word(a, useful_parts):
      return (a.pos_ in useful_parts) and (a.lemma_ not in ['очень']) and (len(a) > 3)


@app.cell
def _(DATA, NLP, re):
    USEFULL_PARTS_FULL = [
        'VERB', 
        'NOUN', 
        'ADJ', 
        'ADV',
        "PUNCT"
    ]

    USEFULL_PARTS_ONLY_DESCRIPTIONS = [
        'ADJ', 
        'ADV',
    ]

    PREP_DATA_FULL = DATA['text'].map_elements(
        lambda b: ' '.join(
            list(
                map(
                    lambda a: a.text, filter(
                        is_usefull_word,
                        NLP(re.sub(r'\s+', ' ', re.sub(r'[-;:,.%]', ' ', re.sub(r'\d+\.?', ' ', b))))
                    )
                )
            )
        ).lower()
    )

    PREP_DATA_ONLY_DESCRIPTIONS = DATA['text'].map_elements(
        lambda b: ' '.join(
            list(
                map(
                    lambda a: a.text, filter(
                        is_usefull_word,
                        NLP(re.sub(r'\s+', ' ', re.sub(r'[-;:,.%]', ' ', re.sub(r'\d+\.?', ' ', b))))
                    )
                )
            )
        ).lower()
    )
    return PREP_DATA_FULL, PREP_DATA_ONLY_DESCRIPTIONS


@app.cell
def _(PIPELINE, PREP_DATA_FULL, PREP_DATA_ONLY_DESCRIPTIONS, torch):
    with torch.no_grad():
        PREP_DATA_FULL_RES = PIPELINE.transform(PREP_DATA_FULL.to_list())
        PREP_DATA_ONLY_DESCRIPTIONS_RES = PIPELINE.transform(PREP_DATA_ONLY_DESCRIPTIONS.to_list())
    return PREP_DATA_FULL_RES, PREP_DATA_ONLY_DESCRIPTIONS_RES


@app.cell
def _(DATA, PREP_DATA_FULL_RES, np):
    Y = DATA['grade']
    Y_p = list(map(lambda a: int(a['label'][-1]), PREP_DATA_FULL_RES))
    np.corrcoef(Y, Y_p)
    return Y, Y_p


@app.cell
def _(DATA, PREP_DATA_ONLY_DESCRIPTIONS_RES, Y, Y_p, np):
    Y1 = DATA['grade']
    Y1_p = list(map(lambda a: int(a['label'][-1]), PREP_DATA_ONLY_DESCRIPTIONS_RES))
    np.corrcoef(Y, Y_p)
    return


if __name__ == "__main__":
    app.run()
