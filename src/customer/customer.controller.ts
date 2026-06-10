import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { GetUser } from '../common/get-user.decorator';
import { CustomerService } from './customer.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { CreateQueryDto } from './dto/create-query.dto';

@Controller('customers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('CUSTOMER')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get('profile')
  getProfile(@GetUser('id') customerId: string) {
    return this.customerService.getProfile(customerId);
  }

  @Get('investments')
  getInvestments(@GetUser('id') customerId: string) {
    return this.customerService.getInvestments(customerId);
  }

  @Post('investments')
  addInvestment(@GetUser('id') customerId: string, @Body() dto: CreateInvestmentDto) {
    return this.customerService.addInvestment(customerId, dto);
  }

  @Get("bookings")
  getBookings() {
    return this.customerService.getAllBookings();
  }

  @Post("bookings")
  createBooking(
    @Body()
    dto: CreateBookingDto,
  ) {
    return this.customerService.createBooking(
      dto
    );
  }

  @Get("bookings/:id")
  getBooking(
    @Param("id")
    id: string,
  ) {
    return this.customerService.getBooking(
      id
    );
  }

  @Patch(
  "bookings/:id/approve"
  )
  approveBooking(
    @Param("id")
    id: string,

    @Body()
    body?: {
      adminId?: string;
    },
  ) {
    return this.customerService.approveBooking(
      id,
      body?.adminId
    );
  }

  @Patch(
  "bookings/:id/complete"
  )
  completeBooking(
    @Param("id")
    id: string,
  ) {
    return this.customerService.completeBooking(
      id
    );
  }

  @Patch(
    "bookings/:id/cancel"
  )
  cancelBooking(
    @Param("id")
    id: string,
  ) {
    return this.customerService.cancelBooking(
      id
    );
  }

  @Patch("bookings/:id/restore")
  restoreBooking(
    @Param("id")
    id: string,
  ) {
    return this.customerService.restoreBooking(
      id,
    );
  }

  @Get('queries')
  getQueries(@GetUser('id') customerId: string) {
    return this.customerService.getQueries(customerId);
  }

  @Get("queries/:id")
  getQuery(
    @Param("id")
    id: string,

    @GetUser("id")
    customerId: string,
  ) {
    return this.customerService.getQuery(
      id,
      customerId,
    );
  }

  @Post('queries')
  createQuery(@GetUser('id') customerId: string, @Body() dto: CreateQueryDto) {
    return this.customerService.createQuery(customerId, dto);
  }

  @Post("queries/:id/reply")
  replyToQuery(
    @Param("id")
    queryId: string,

    @GetUser("id")
    customerId: string,

    @Body()
    body: {
      message: string;
    },
  ) {
    return this.customerService.replyToQuery(
      queryId,
      customerId,
      body.message,
    );
  }
}
