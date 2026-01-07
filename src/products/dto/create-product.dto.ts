import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  buy_price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stock_amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  unit: string;
}
