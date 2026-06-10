import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AdminService } from './admin.service';
import { Permission } from '../common/permission.decorator';
import { Permissions } from "../common/permissions";
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PermissionGuard } from '../common/permission.guard';
import { ReplyQueryDto } from './dto/reply-query.dto';

@Controller("admin")
@UseGuards(
  AuthGuard("jwt"),
  RolesGuard,
  PermissionGuard
)
@Roles(
  "ADMIN",
  "SUPER_ADMIN"
)
export class AdminController {

  constructor(private adminService: AdminService) {}

    @Get("permissions")
    getPermissions() {
      return Object.values(Permissions);
    }

  @Post('customers')
  @Permission(
    Permissions.CUSTOMER_CREATE
  )
  createCustomer(@Body() dto: CreateCustomerDto) {
    return this.adminService.createCustomer(dto);
  }

  @Patch('customers/:id')
  @Permission(
    Permissions.CUSTOMER_EDIT
  )
  updateCustomer(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.adminService.updateCustomer(id, dto);
  }

  @Get('customers')
  @Permission(
    Permissions.CUSTOMER_VIEW
  )
  getCustomers() {
    return this.adminService.getCustomers();
  }

  @Get('customers/:id')
  getCustomer(@Param('id') id: string) {
    return this.adminService.getCustomerById(id);
  }

  @Get("bookings")
  getBookings() {
    return this.adminService.getAllBookings();
  }

  @Get("admins")
  @Permission(
    Permissions.ADMIN_VIEW
  )
  getAdmins() {
    return this.adminService.getAdmins();
  }

  @Get("admins/:id")
  @Permission(
    Permissions.ADMIN_VIEW
  )
  getAdmin(
    @Param("id")
    id: string
  ) {
    return this.adminService.getAdminById(
      id
    );
  }

  @Patch("admins/:id")
  @Permission(
    Permissions.ADMIN_EDIT
  )
  updateAdmin(
    @Param("id")
    id: string,

    @Body()
    dto: UpdateAdminDto
  ) {
    return this.adminService.updateAdmin(
      id,
      dto
    );
  }

  @Patch(
    "admins/:id/status"
  )
  @Permission(
    Permissions.ADMIN_EDIT
  )
  toggleAdmin(
    @Param("id")
    id: string,

    @Body()
    body: {
      active: boolean;
    }
  ) {
    return this.adminService.toggleAdmin(
      id,
      body.active
    );
  }

  @Patch("customers/:id/status")
  @Permission(
    Permissions.CUSTOMER_EDIT
  )
  toggleCustomer(
    @Param("id") id: string,

    @Body()
    body: {
      active: boolean;
    }
  ) {
    return this.adminService.toggleCustomer(
      id,
      body.active
    );
  }

  @Get("queries")
  getQueries() {
    return this.adminService.getAllQueries();
  }

  @Get("queries/:id")
  getQuery(
    @Param("id")
    id: string,
  ) {
    return this.adminService.getQuery(id);
  }

  @Post(
    "queries/:id/reply"
  )
  replyToQuery(
    @Param("id")
    id: string,

    @Body()
    dto: ReplyQueryDto,
  ) {
    return this.adminService.replyToQuery(
      id,
      dto.message,
    );
  }

  @Patch("queries/:id/close")
  closeQuery(
    @Param("id")
    id: string,
  ) {
    return this.adminService.closeQuery(id);
  }

  
}
