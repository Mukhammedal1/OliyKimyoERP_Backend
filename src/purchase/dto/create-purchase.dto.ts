import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

class ProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  product_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  total_price: number;
}

export class CreatePurchaseDto {
  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  supplier: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  total_amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  paid_amount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  supplier_phone: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_new_supplier: boolean;

  @ApiProperty({ type: [ProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
