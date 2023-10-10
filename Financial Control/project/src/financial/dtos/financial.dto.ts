import { IsString, IsNotEmpty, IsPositive, IsNumber, Max, Matches, IsOptional, IsBoolean, IsInt, Min } from "class-validator";

class DefaultTransactionDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?!0+(\.00*)?$)(?:\d{1,10}\.\d{2}|\d{1,10})$/, {
        message: "unit_price must match the format: XXXX.XX or XXXX (Decimal(10,2) or Integer(10))",
    })
    unit_price: string;

    @IsOptional()
    @IsBoolean()
    has_receipt?: boolean = false;

    @IsOptional()
    @IsInt()
    receipt_id?: number = null;

    @IsOptional()
    @IsInt()
    category_id?: number = null;

    @IsInt()
    @IsNotEmpty()
    user_id: number;
}

export class DebitDto extends DefaultTransactionDto {
    @IsPositive()
    @IsInt()
    @Min(1)
    @Max(99)
    amount: number;
}

export class CreditDto extends DefaultTransactionDto {
    @IsPositive()
    @IsInt()
    @Min(1)
    @Max(24)
    total_installments: number;

    @IsOptional()
    @IsBoolean()
    installments_paid?: boolean = false;

    @IsInt()
    @Min(0)
    @Max(0)
    amount: number;
}

export class IncomeDto extends DefaultTransactionDto {
    @IsPositive()
    @IsInt()
    @Min(1)
    @Max(1)
    amount: number;
}

export class DefaultUpdateDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsOptional()
    @IsBoolean()
    has_receipt?: boolean;

    @IsOptional()
    @IsInt()
    receipt_id?: number;

    @IsOptional()
    @IsInt()
    category_id?: number;

    @IsInt()
    @IsNotEmpty()
    user_id: number;
}

export class UpdateDebitIncomeDto extends DefaultUpdateDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?!0+(\.00*)?$)(?:\d{1,10}\.\d{2}|\d{1,10})$/, {
        message: "unit_price must match the format: XXXX.XX or XXXX (Decimal(10,2) or Integer(10))",
    })
    unit_price?: string;

    @IsOptional()
    @IsPositive()
    @IsInt()
    @Min(1)
    @Max(99)
    amount?: number;
}

export class DeleteDto {
    @IsInt()
    @IsNotEmpty()
    user_id: number;
}