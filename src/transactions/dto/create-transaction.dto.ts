import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  incomeExpenseType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  saleId?: string ;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  purchaseId?: string ;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  customerId?: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  supplierId?: string;
}
