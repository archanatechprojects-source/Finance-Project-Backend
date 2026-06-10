import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async getProfile(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        investments: true,
        bookings: true,
        queries: true,
      },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return {
      ...customer,
      growth: this.calculateGrowth(customer.investedAmount, customer.investments),
    };
  }

  async getInvestments(customerId: string) {
    return this.prisma.investment.findMany({
      where: { customerId },
      orderBy: { investmentDate: 'desc' },
    });
  }

  async addInvestment(customerId: string, dto: CreateInvestmentDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const investment = await this.prisma.investment.create({
      data: {
        customerId,
        assetName: dto.assetName,
        amount: dto.amount,
        notes: dto.notes,
      },
    });
    await this.prisma.customer.update({
      where: { id: customerId },
      data: { investedAmount: customer.investedAmount + dto.amount },
    });
    return investment;
  }

  async getAllBookings() {
    return this.prisma.booking.findMany({
      include: {
        customer: true,
        admin: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getBooking(
    id: string,
  ) {
    return this.prisma.booking.findUnique({
      where: {
        id,
      },

      include: {
        customer: true,
        admin: true,
      },
    });
  }

  async createBooking(
    dto: CreateBookingDto,
  ) {
    return this.prisma.booking.create({
      data: {
        customerId: dto.customerId ?? undefined,
        isGuest: !dto.customerId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,

        scheduledAt: new Date(
          dto.scheduledAt
        ),

        topic: dto.topic,
        notes: dto.notes,
      },
    });
  }

  async updateBooking(
    id: string,
    dto: UpdateBookingDto,
  ) {
    return this.prisma.booking.update({
      where: { id },

      data: {
        customerId:
          dto.customerId ?? undefined,

        name: dto.name,
        email: dto.email,
        phone: dto.phone,

        topic: dto.topic,
        notes: dto.notes,

        scheduledAt:
          dto.scheduledAt
            ? new Date(dto.scheduledAt)
            : undefined,
      },
    });
  }

  async cancelBooking(
    id: string,
  ) {
    return this.prisma.booking.update({
      where: {
        id,
      },

      data: {
        status: "CANCELED",
      },
    });
  }

  async approveBooking(
    id: string,
    adminId?: string,
  ) {
    return this.prisma.booking.update({
      where: {
        id,
      },

      data: {
        status:
          "CONFIRMED",

        adminId,
      },
    });
  }

  async completeBooking(
    id: string,
  ) {
    return this.prisma.booking.update({
      where: {
        id,
      },

      data: {
        status:
          "COMPLETED",
      },
    });
  }

  async restoreBooking(
    id: string,
  ) {
    return this.prisma.booking.update({
      where: { id },
      data: {
        status: "PENDING",
      },
    });
  }

  async getQueries(customerId: string) {
    return this.prisma.customerQuery.findMany({
      where: {
        customerId,
      },

      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getQuery(
    queryId: string,
    customerId: string,
  ) {
    return this.prisma.customerQuery.findFirst({
      where: {
        id: queryId,
        customerId,
      },

      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  async createQuery(
    customerId: string,
    dto: CreateQueryDto,
  ) {
    const query =
      await this.prisma.customerQuery.create({
        data: {
          customerId,
          subject: dto.subject,
        },
      });

    await this.prisma.queryMessage.create({
      data: {
        queryId: query.id,
        sender: "CUSTOMER",
        message: dto.message,
      },
    });

    return this.prisma.customerQuery.findUnique({
      where: {
        id: query.id,
      },
      include: {
        messages: true,
      },
    });
  }

//   private calculateGrowth(currentValue: number, investments: { amount: number }[]) {
//     const invested = investments.reduce((sum, item) => sum + item.amount, 0);
//     return currentValue - invested;
//   }

private calculateGrowth(
  currentValue: number,
  investments: { amount: number }[],
) {
  const invested = investments.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const growth = currentValue - invested;

  const growthPercent =
    invested > 0
      ? (growth / invested) * 100
      : 0;

  return {
    invested,
    currentValue,
    growth,
    growthPercent,
  };
}

async replyToQuery(
  queryId: string,
  customerId: string,
  message: string,
) {
  const query =
    await this.prisma.customerQuery.findFirst({
      where: {
        id: queryId,
        customerId,
      },
    });

  if (!query) {
    throw new NotFoundException(
      "Query not found",
    );
  }

  if (query.status === "CLOSED") {
    throw new Error(
      "This query has been closed",
    );
  }

  return this.prisma.queryMessage.create({
    data: {
      queryId,
      sender: "CUSTOMER",
      message,
    },
  });
}
}
