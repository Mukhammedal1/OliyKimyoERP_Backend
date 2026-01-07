import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { AdminAuthService } from './admin_auth.service';
import { SignInDto } from '../admin/dto/admin-signIn.dto';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { JwtPayloadWithRefreshToken } from '../common/types';
import { CookieGetter } from '../common/decorators/cookie-getter.decorator';

@Controller('admin_auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('signup')
  async signUp(@Body() createAdminDto: CreateAdminDto) {
    return this.adminAuthService.signUp(createAdminDto);
  }

  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminAuthService.signIn(signInDto, res);
  }

  @HttpCode(200)
  @Post('signout')
  signout(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    return this.adminAuthService.signOut(userId, res);
  }

  @Post('refresh/:adminId')
  async refresh(
    // @GetCurrentUserId() adminId: string,
    // @GetCurrentUser('refreshToken') refreshToken: string,
    // @GetCurrentUser() admin: JwtPayloadWithRefreshToken,
    @Param("adminId") adminId: string,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminAuthService.refreshToken(adminId, refreshToken, res);
  }
}
