import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Role } from "@prisma/client";
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateAdmin(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
    const passwordMatches = await bcrypt.compare(password, admin.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    return admin;
  }

  async validateCustomer(email: string, password: string) {
    const customer = await this.prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      throw new UnauthorizedException('Invalid customer credentials');
    }
    const passwordMatches = await bcrypt.compare(password, customer.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid customer credentials');
    }

    return customer;
  }

  async loginAdmin(admin: any) {
    const adminWithPermissions =
      await this.prisma.admin.findUnique({
        where: {
          id: admin.id,
        },
        include: {
          permissions: true,
        },
      });

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const token =
      this.jwtService.sign(payload);

    return {
      accessToken: token,

      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,

        permissions:
          adminWithPermissions?.permissions.map(
            (p) => p.code
          ) || [],
      },
    };
  }

  async loginCustomer(customer) {
    const payload = {
      sub: customer.id,
      email: customer.email,
      role: "CUSTOMER",
    };

    return {
      accessToken:
        this.jwtService.sign(payload),

      user: {
        id: customer.id,
        email: customer.email,
        role: "CUSTOMER",
      },
    };
  }

  async createAdmin(
    dto: CreateAdminDto
  ) {

    const existing =
    await this.prisma.admin.findUnique({
      where: {
        email: dto.email,
      },
    });

  if (existing) {
    throw new ConflictException(
      "Admin already exists"
    );
  }

    const hashed =
      await bcrypt.hash(
        dto.password,
        10
      );

    return this.prisma.admin.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashed,
        role: Role.ADMIN,

        permissions: {
          create:
            dto.permissions.map(
              (p) => ({
                code: p,
              })
            ),
        },
      },
      include: {
        permissions: true,
      },
    });
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const admin = await this.prisma.admin.findUnique({
      where: { email },
      include: {
        permissions: true,
      },
    });

    if (admin) {
      const valid = await bcrypt.compare(
        password,
        admin.password,
      );

      if (!valid) {
        throw new UnauthorizedException(
          'Invalid credentials',
        );
      }

      return this.loginAdmin(admin);
    }

    const customer =
      await this.prisma.customer.findUnique({
        where: { email },
      });

    if (customer) {
      const valid = await bcrypt.compare(
        password,
        customer.password,
      );

      if (!valid) {
        throw new UnauthorizedException(
          'Invalid credentials',
        );
      }

      return this.loginCustomer(customer);
    }

    throw new UnauthorizedException(
      'Invalid credentials',
    );
  }
}
