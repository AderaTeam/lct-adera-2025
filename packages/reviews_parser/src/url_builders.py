def get_url_for_review(idx):
    return rf'https://www.banki.ru/services/responses/bank/response/{idx}/'


def get_url_for_list_of_review(idx):
    return fr'https://www.banki.ru/services/responses/list/ajax/?page={idx}&is_countable=on&bank=gazprombank'
