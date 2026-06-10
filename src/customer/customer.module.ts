import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicController } from './no-auth.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController,PublicController],
  providers: [CustomerService],
})
export class CustomerModule {}
