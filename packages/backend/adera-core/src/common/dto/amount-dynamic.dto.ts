import { IsInt, IsNotEmpty, IsString } from "class-validator"

export class AmountDynamicDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsInt()
    @IsNotEmpty()
    amount: number
}