import {
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
} from "class-validator";

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  customerId?: string | null;

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsDateString()
  scheduledAt!: string;

  @IsString()
  topic!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}