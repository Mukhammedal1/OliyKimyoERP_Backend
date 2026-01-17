import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: "Name 3 dan 20 gacha bo'lishi kerak" })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[0-9]{9}$/, {
    message: 'Telefon raqamni quyidagicha kiriting: 90 123 45 67 ',
  })
  phone_number: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  debt_amount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;
}
