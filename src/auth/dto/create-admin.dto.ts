import {
  IsArray,
  IsEmail,
  IsString,
} from "class-validator";

export class CreateAdminDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsArray()
  permissions!: string[];
}