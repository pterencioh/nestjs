import { IsString, IsNotEmpty, IsPositive, IsNumber, Max, Matches, IsOptional, IsBoolean, IsInt, Min, MaxLength, MinLength, IsDate } from "class-validator";

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

export class CategoryDto {
    @MaxLength(20)
    @MinLength(3)
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class ReceiptDto {
    @MaxLength(200)
    @MinLength(10)
    @IsNotEmpty()
    @Matches(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, {
        message: "URL not valid, tip: URL needs the 'https://'"
    })
    @IsString()
    url_attachment: string;

    @IsNotEmpty()
    @IsDate()
    receipt_date: Date;

    @IsOptional()
    @IsInt()
    category_id?: number;
}

export class UpdateReceiptDto {
    @MaxLength(200)
    @MinLength(10)
    @IsOptional()
    @Matches(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, {
        message: "URL not valid, tip: URL needs the 'https://'"
    })
    @IsString()
    url_attachment?: string;

    @IsOptional()
    @IsDate()
    receipt_date?: Date;

    @IsOptional()
    @IsInt()
    category_id?: number;
}