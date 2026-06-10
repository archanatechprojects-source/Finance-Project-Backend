import { IsEmail, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsArray()
  permissions?: string[];

  @IsOptional()
  active?: boolean;
}