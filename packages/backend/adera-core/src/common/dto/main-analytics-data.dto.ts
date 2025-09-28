import { CountsDataDto } from "./counts-data.dto"
import { TopicDataDto } from "./topic-data.dto"

export class MainAnalytiscDataDto {
    topics: TopicDataDto[]
    counts: CountsDataDto
}