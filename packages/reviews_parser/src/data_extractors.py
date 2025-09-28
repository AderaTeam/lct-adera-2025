def banki_ru_data_extractor(data):
    return {
        "review_title": data["title"],
        "review_text": data['text'],
        "grade": data["grade"],
        'city_name': data.get("city_name", ""),
        "created_at": data["dateCreate"]
    }


def sravni_ru_data_extractor(data):
    return {
        "review_title": data["title"],
        "review_text": data['text'],
        "grade": data["rating"],
        'city_name': data.get("locationData", dict()).get("fullName", ""),
        "created_at": data["date"]
    }
