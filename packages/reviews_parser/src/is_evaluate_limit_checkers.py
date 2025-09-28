def is_evaluate_limit_checkers_for_banki_ru(data):
    return not data.get('hasMorePages', True)


def is_evaluate_limit_checkers_for_sravni_ru(data):
    return data.get('pageIndex', 0) == data["total"]