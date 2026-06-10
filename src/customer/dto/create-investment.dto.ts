import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsNotEmpty()
  @IsString()
  assetName!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
