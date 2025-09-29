from pydantic import BaseModel
from typing import List


class ReviewDescriptionModel(BaseModel):
    id: int
    text: str

class GetAnalizeModel(BaseModel):
    data: List[ReviewDescriptionModel]
