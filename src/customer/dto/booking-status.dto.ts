import {
  IsEnum,
  IsOptional,
} from "class-validator";

import {
  BookingStatus,
} from "@prisma/client";

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status!: BookingStatus;

  @IsOptional()
  adminId?: string;
}