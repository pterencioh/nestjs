import { IsString, IsNotEmpty, IsPositive, IsNumber, Max, Matches, IsOptional, IsBoolean, IsInt } from "class-validator";

class defaultTransactionDto {
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

export class DebitDto extends defaultTransactionDto {
    @IsPositive()
    @IsInt()
    @Max(99)
    amount: number;
}

export class CreditDto extends defaultTransactionDto {
    @IsPositive()
    @IsInt()
    @Max(99)
    total_installments: number;

    @IsOptional()
    @IsBoolean()
    installments_paid?: boolean = false;
}

export class IncomeDto extends defaultTransactionDto {
    @IsPositive()
    @IsInt()
    @Max(1)
    amount: number;
}