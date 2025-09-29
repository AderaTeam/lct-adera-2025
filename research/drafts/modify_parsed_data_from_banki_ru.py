import marimo

__generated_with = "0.16.0"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import json
    import os
    from bs4 import BeautifulSoup

    import polars as pl

    return BeautifulSoup, json, os, pl


@app.cell
def _(json, os):
    REVIEWS_JSON_LIST_PATH = "../review_parser/DATA/BANKI_RU/REVIEWS/"
    REVIEWS_JSON_LIST = os.listdir(REVIEWS_JSON_LIST_PATH)
    print('', len(REVIEWS_JSON_LIST))
    def load_review_json(json_name):
        with open(REVIEWS_JSON_LIST_PATH + json_name) as f:
            example_review = json.load(f)
        return example_review
    return REVIEWS_JSON_LIST, load_review_json


@app.cell
def _(BeautifulSoup):
    # soup = BeautifulSoup(load_review_json(REVIEWS_JSON_LIST[2])['full_review_text'], 'html.parser')
    # soup.find('span', attrs={'class': 'l3a372298'}), soup.find_all('span')[25]
    def bs4_find_post_processor(element, postprocessor=str):
        return None if element == None else postprocessor(element.text)

    
    def get_raiting(text):
        soup = BeautifulSoup(text, 'html.parser')
        raiting=soup.find('div', {'class': 'rating-grade'})
        place_posted=soup.find('span', attrs={'class': 'l3a372298'})
        date_posted=soup.find('span', attrs={'class': 'l10fac986'})
    
        d = dict(
            raiting=bs4_find_post_processor(raiting, int),
            place_posted=bs4_find_post_processor(place_posted),
            date_posted=bs4_find_post_processor(date_posted)
        )
    
        return d
    
    
    return (get_raiting,)


@app.cell
def _(REVIEWS_JSON_LIST, load_review_json, pl):
    DATA = pl.DataFrame(map(load_review_json, REVIEWS_JSON_LIST))
    return (DATA,)


@app.cell
def _(DATA, get_raiting, pl):
    DATA_HTML_EXTRACTED = DATA.with_columns(
        pl.col('full_review_text').map_elements(
            get_raiting, 
            return_dtype=pl.Struct([
                pl.Field("raiting", pl.Int64), 
                pl.Field("place_posted", pl.String),
                pl.Field('date_posted', pl.String)
            ])
        ).struct.unnest()
    ).drop('full_review_text')
    return (DATA_HTML_EXTRACTED,)


@app.cell
def _(DATA_HTML_EXTRACTED, pl):
    DATA_TEXT_CLEAN = DATA_HTML_EXTRACTED.with_columns(pl.col('text').str.replace_all(r'<\/?\w+>', ' '))
    return (DATA_TEXT_CLEAN,)


@app.cell
def _(DATA_TEXT_CLEAN):
    DATA_TEXT_CLEAN.drop('company').write_csv('../DATA/full_dataset_banki_ru.csv')
    return


if __name__ == "__main__":
    app.run()
