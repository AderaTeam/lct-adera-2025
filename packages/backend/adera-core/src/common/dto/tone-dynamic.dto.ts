import { IsInt, IsNotEmpty, IsString } from "class-validator"

export class ToneDynamicDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsInt()
    @IsNotEmpty()
    positive: number

    @IsInt()
    @IsNotEmpty()
    neutral: number

    @IsInt()
    @IsNotEmpty()
    negative: number
}