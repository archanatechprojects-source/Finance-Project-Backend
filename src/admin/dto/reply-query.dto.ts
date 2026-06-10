import {
  IsNotEmpty,
  IsString,
} from "class-validator";

export class ReplyQueryDto {
  @IsString()
  @IsNotEmpty()
  message!: string;
}