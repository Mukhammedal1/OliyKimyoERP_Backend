import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
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

}
