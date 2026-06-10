import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQueryDto {
  @IsNotEmpty()
  @IsString()
  subject!: string;

  @IsNotEmpty()
  @IsString()
  message!: string;
}
