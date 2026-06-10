import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllBookings() {
    return this.prisma.booking.findMany({
        include: {
        customer: true,
        },
        orderBy: {
        createdAt: "desc",
        },
    });
    }

  async createCustomer(dto: CreateCustomerDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.customer.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        profile: dto.profile,
        investedAmount: dto.investedAmount ?? 0,
      },
    });
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const data: any = {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      profile: dto.profile,
      investedAmount: dto.investedAmount,
    };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    return this.prisma.customer.update({ where: { id }, data });
  }

    async getCustomers() {
    return this.prisma.customer.findMany({
        orderBy: {
        createdAt: 'desc',
        },
        select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profile: true,
        investedAmount: true,
        active: true,
        createdAt: true,
        investments: true,
        bookings: true,
        queries: true,
        },
    });
    }

  async getCustomerById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        investments: true,
        bookings: true,
        queries: true,
      },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async getAdmins() {
    return this.prisma.admin.findMany({
      include: {
        permissions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getAdminById(id: string) {
    return this.prisma.admin.findUnique({
      where: {
        id,
      },
      include: {
        permissions: true,
      },
    });
  }

  async updateAdmin(
    id: string,
    dto: UpdateAdminDto
  ) {

    await this.prisma.permission.deleteMany({
      where: {
        adminId: id,
      },
    });

    return this.prisma.admin.update({
      where: {
        id,
      },

      data: {
        name: dto.name,
        email: dto.email,
        active: dto.active,

        permissions: {
          create:
            dto.permissions?.map(
              (permission) => ({
                code: permission,
              })
            ) || [],
        },
      },

      include: {
        permissions: true,
      },
    });
  }

  async toggleAdmin(
    id: string,
    active: boolean
  ) {
    return this.prisma.admin.update({
      where: {
        id,
      },
      data: {
        active,
      },
    });
  }

  async toggleCustomer(
    id: string,
    active: boolean,
  ) {
    return this.prisma.customer.update({
      where: { id },
      data: {
        active,
      },
    });
  }

  async getAllQueries() {
    return this.prisma.customerQuery.findMany({
      include: {
        customer: {
          include: {
            investments: true,
          },
        },

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
    id: string,
  ) {
    return this.prisma.customerQuery.findUnique({
      where: {
        id,
      },

      include: {
        customer: {
          include: {
            investments: true,
          },
        },

        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  async replyToQuery(
    queryId: string,
    message: string,
  ) {
    const query =
      await this.prisma.customerQuery.findUnique({
        where: {
          id: queryId,
        },
      });

    if (!query) {
      throw new NotFoundException(
        "Query not found",
      );
    }

    if (query.status === "CLOSED") {
      throw new Error(
        "This query has already been closed",
      );
    }

    return this.prisma.queryMessage.create({
      data: {
        queryId,
        sender: "ADMIN",
        message,
      },
    });
  }
  async closeQuery(
    queryId: string,
  ) {
    const query =
      await this.prisma.customerQuery.findUnique({
        where: {
          id: queryId,
        },
      });

    if (!query) {
      throw new NotFoundException(
        "Query not found",
      );
    }

    return this.prisma.customerQuery.update({
      where: {
        id: queryId,
      },
      data: {
        status: "closed",
      },
    });
  }

}
