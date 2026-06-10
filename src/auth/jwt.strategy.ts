import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  PassportStrategy,
} from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy
  extends PassportStrategy(
    Strategy
  )
{
  constructor(
    config: ConfigService, private prisma: PrismaService
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        config.get<string>(
          'JWT_SECRET'
        ),
    });
  }

  async validate(payload: any) {

    if (payload.role === "CUSTOMER") {

      const customer =
        await this.prisma.customer.findUnique({
          where: {
            id: payload.sub,
          },
        });

      if (!customer) {
        throw new UnauthorizedException();
      }

      return {
        id: customer.id,
        email: customer.email,
        role: "CUSTOMER",
        permissions: [],
      };
    }

    const admin =
      await this.prisma.admin.findUnique({
        where: {
          id: payload.sub,
        },
        include: {
          permissions: true,
        },
      });

    if (!admin) {
      throw new UnauthorizedException();
    }

    return {
      id: admin.id,
      email: admin.email,
      role: admin.role,

      permissions:
        admin.permissions.map(
          (p) => p.code
        ),
    };
  }
}