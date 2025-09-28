# from constants import EMBEDER_MODEL
# from optimum.onnxruntime import ORTModelForFeatureExtraction
# from transformers import AutoTokenizer, pipeline
# import torch
# t = "<p>Подключен пакет услуг \"Премиум\". 1 августа открывал вклад через приложение. Во время открытия появилось сообщение, что при подключении подписки \"Плюс\" будет +1% к ставке. Ок, подключаю и её, после этого открываю вклад. В итоге в приложении у вклада отображается что подписка подключена, с ней +1%, но ожидаемый доход рассчитан без неё. Звоню на горячую линию. Оператор смотрит, говорит да, сначала была подключена подписка, потом был открыт вклад, на него должна действовать повышенная ставка. Не волнуйтесь, чуть позже отобразится всё правильно.</p>\r\n<p>Вчера решил проверить процентую ставка - она всё так же ниже, чем должна быть. Звоню на горячую линию снова. Оператор сначала говорит то же самое, что и предыдущий, а потом решает проверить ещё что-то и отвечает: \"У вас карта открыта в Поволсжком регионе, а подписка подлючена для Московского, поэтому повышенная ставка не действует\". Честно говоря, я сначала не поверил своим ушам. Говорю это видимо какое-то недоразумение, давайте составим обращение, уверен что всё исправят. А сегодня на это обращение получил тот же самый ответ, что карта и вклад открыты в разных филиалах, и поэтому повышенная ставка не действует (парам парарам и картника из \"Ералаша\" \"Всё\").</p>\r\n<p></p>\r\n<p>Подводим итоги:</p>\r\n<p>1. Ещё раз акцентирую внимание - это премиальное обслуживание банка! В других банках с премиумом такие вещи решаются за минуту.</p>\r\n<p>2. Некомпетентность операторов, которые при звонке сразу после открытия счёта дали неверную информацию.</p>\r\n<p>3. Неверное отображение информации о счёте в приложение, где отображается плашка что подписка подключена и действует повышенная ставка.</p>\r\n<p>4. Ну и просто шедевральный функционал, когда при работе через мобильное приложение подключаются услуги на разные филиалы. Напомнило один зелёный банк со своим легендарным \"Вот где открывали счёт, туда и идите\". Только там такое было лет 15 назад, а в \"Газпромбанке\" это возможно в наши дни.</p>"

# mn = "ai-forever/sbert_large_nlu_ru"
# tokenizer = AutoTokenizer.from_pretrained(mn)
# m = ORTModelForFeatureExtraction.from_pretrained(mn)
# onnx_extractor = pipeline("feature-extraction", model=m, tokenizer=tokenizer, device='cpu')
# with torch.inference_mode():
#     print('='*40)
#     pred = onnx_extractor(t)
#     print(pred)



# Запуск упрощенной версии
from time import sleep
from scripts import clean_text_dataframe_builder, convert_to_json, correct_creation_dependency_matrix, get_tree_tuples
import torch
from bd_comunications import get_reviews_without_topics_simple, insert_missing_topics_simple, populate_review_topics_from_polars
import polars as pl
import numpy as np

from constants import PIPELINE, PRESELECTED_TOPICS, SENTIMENT_MODEL
from sklearn.metrics.pairwise import cosine_similarity

insert_missing_topics_simple(PRESELECTED_TOPICS)

PRESELECTED_TOPICS_EMBEDDINGS = torch.cat(list(map(
    lambda a: a.sum(1) / a.shape[1],
    PIPELINE(
        list(map(lambda a: '. '.join(a), PRESELECTED_TOPICS.items())), 
        return_tensors=True
    )
)))
# PRESELECTED_TOPIC_NAMES_ARRAY = torch.cat(list(map(
#     lambda a: a.sum(1) / a.shape[1], 
#     PIPELINE(PRESELECTED_TOPICS_EMBEDDINGS, return_tensors=True)
# )))
PRESELECTED_TOPIC_NAMES_ARRAY = np.array(list(PRESELECTED_TOPICS.keys()))

if __name__ == "__main__":
    while True:
        root_dataframe = get_reviews_without_topics_simple()
        root_dataframe_with_clean_text = clean_text_dataframe_builder(root_dataframe)
        sentences_splited = list()
        sentences_splited_idx = list()
        for i, ti in enumerate(root_dataframe_with_clean_text['clean_text']):
            tokens, adj_matrix, _, _ = correct_creation_dependency_matrix(ti)
            for st in get_tree_tuples(adj_matrix, tokens):
                if st != None:
                    sentences_splited.append(st)
                    sentences_splited_idx.append(root_dataframe_with_clean_text[i, 'review_id'])
        with torch.inference_mode():
            ste = torch.cat(list(map(
                lambda a: a.sum(1) / a.shape[1], 
                PIPELINE(sentences_splited, return_tensors=True)
            )))
        distances_from_topic = cosine_similarity(ste, PRESELECTED_TOPICS_EMBEDDINGS)
        selected_topics = PRESELECTED_TOPIC_NAMES_ARRAY[distances_from_topic.argmax(1)]
        sentiment_analize = SENTIMENT_MODEL.predict(ste.numpy())
        db = pl.DataFrame([
            dict(review_id=t_idx, review_topic=t, review_sentiment=sent, p=p) 
            for t_idx, st, t, sent, p in zip(
                sentences_splited_idx, 
                sentences_splited, 
                selected_topics, 
                sentiment_analize,
                distances_from_topic.max(1)
            )
        ])
        db_c = convert_to_json(db)
        if db_c.shape[0] > 0:
            populate_review_topics_from_polars(db_c)
        else:
            sleep(60)