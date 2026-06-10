import { IsEmail, IsOptional, IsString, Min, IsNumber } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  profile?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  investedAmount?: number;
}
