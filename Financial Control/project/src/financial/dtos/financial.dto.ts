import { IsString, IsNotEmpty, IsCurrency, IsPositive, IsNumber, MaxLength, Max, Matches } from "class-validator";

export class transactionDto {
    @IsString()
    @IsNotEmpty()
    description : string;

    @Matches(/^(?!0+(\.00*)?$)(?:\d{1,10}\.\d{2}|\d{1,10})$/, {message: "unit_price must match the format: XXXX.XX or XXXX (Decimal(10,2) or Integer(10))"})
    unit_price: string;

    @IsPositive()
    @IsNumber()
    @Max(99)
    amount: number;

    @IsNumber()
    @IsNotEmpty()
    user_id: number; 
}