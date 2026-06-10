import { Body, Controller, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('public')
export class PublicController {
  constructor(private customerService: CustomerService) {}

  @Post('bookings')
  createGuestBooking(@Body() dto: CreateBookingDto) {
    return this.customerService.createBooking(dto);
  }
}