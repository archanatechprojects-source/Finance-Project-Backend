import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  profile?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  investedAmount?: number;
}
