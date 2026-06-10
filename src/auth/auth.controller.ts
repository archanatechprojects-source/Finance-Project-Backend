import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { JwtAuthGuard } from './guards/JwtAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("admin")
  @UseGuards(
    JwtAuthGuard,
    SuperAdminGuard
  )
  createAdmin(
    @Body()
    dto: CreateAdminDto
  ) {
    return this.authService.createAdmin(
      dto
    );
  }

  @Post('admin/login')
  async adminLogin(@Body() dto: LoginDto) {
    // eslint-disable-next-line prettier/prettier
    const admin = await this.authService.validateAdmin(
        dto.email,
        dto.password,
      );

    return this.authService.loginAdmin(admin);
  }

  @Post('customer/login')
  async customerLogin(@Body() dto: LoginDto) {
    const customer =
      await this.authService.validateCustomer(
        dto.email,
        dto.password,
      );

    return this.authService.loginCustomer(customer );
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
