import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";

import { PrismaService }
  from "../prisma/prisma.service";

@Injectable()
export class PermissionGuard
  implements CanActivate
{
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(
    context: ExecutionContext
  ) {

    const permissions =
      this.reflector.get<string[]>(
        "permissions",
        context.getHandler()
      );

    if (!permissions)
      return true;

    const req =
      context
        .switchToHttp()
        .getRequest();

    if (
      req.user.role ===
      "SUPER_ADMIN"
    ) {
      return true;
    }

    const admin =
      await this.prisma.admin.findUnique({
        where: {
          id: req.user.id,
        },
        include: {
          permissions: true,
        },
      });

    const adminPermissions =
      admin?.permissions.map(
        (p) => p.code
      ) || [];

    return permissions.every(
      (p) =>
        adminPermissions.includes(
          p
        )
    );
  }
} 