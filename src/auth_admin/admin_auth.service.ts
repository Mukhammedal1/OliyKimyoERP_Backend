import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from '../admin/admin.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { Admin, AdminDocument } from '../admin/entities/admin.entity';
import { SignInDto } from '../admin/dto/admin-signIn.dto';
import * as bcrypt from 'bcrypt';
import type ms from 'ms';
import { log } from 'console';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}
  async getTokens(admin: AdminDocument) {
    const payload = {
      id: admin._id.toString(),
      is_creator: admin.is_creator,
      email: admin.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ADMIN_ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME as ms.StringValue,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.ADMIN_REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME as ms.StringValue,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signUp(createAdminDto: CreateAdminDto) {
    const admin1 = await this.adminService.findOneByEmail(createAdminDto.email);
    if (admin1) {
      throw new BadRequestException('Bunday admin mavjud');
    }
    const admin2 = await this.adminService.findOneByLogin(createAdminDto.login);
    if (admin2) {
      throw new BadRequestException('Bunday admin mavjud');
    }
    const newadmin = await this.adminService.create(createAdminDto);
    const response = {
      message:
        "Tabriklayman tizimga qo'shildingiz. Akkauntni faollashtirish uchun emailga xat yuborildi",
      adminId: newadmin._id,
    };
    return response;
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const admin = await this.adminService.findOneByLogin(signInDto.login);
    if (!admin) {
      throw new BadRequestException('Login yoki parol xato');
    }
    // if (!user.is_active) {
    //   throw new BadRequestException("User is not active");
    // }

    const isvalidPassword = await bcrypt.compare(
      signInDto.password,
      admin.hashedPassword,
    );

    if (!isvalidPassword) {
      throw new UnauthorizedException('Login yoki parol xato');
    }
    const tokens = await this.getTokens(admin);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedAdmin = await this.adminService.updateRefreshToken(
      String(admin._id),
      hashed_refresh_token,
    );
    if (!updatedAdmin) {
      throw new InternalServerErrorException('Tokenni saqlashda xatolik');
    }
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // Number(process.env.COOKIE_TIME)
      httpOnly: true,
      secure: false, // https bo‘lsa true bo'ladi
      sameSite: 'lax',
    });
    const response = {
      message: 'Admin logged in',
      adminId: admin._id,
      access_token: tokens.access_token,
    };
    return response;
  }

  async signOut(adminId: string, res: Response) {
    await this.adminService.clearRefreshToken(adminId);
    res.clearCookie('refresh_token');
    return true;
  }

  async refreshToken(adminId: string, refreshToken: string, res: Response) {

    let decoded: any;
    try {
      decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.ADMIN_REFRESH_TOKEN_KEY,
      });
      console.log("verify togri")
    } catch (error) {
      console.log("refresh tugadi")
      res.clearCookie("refresh_token")
      throw new UnauthorizedException('Refresh token expired');
    }
    
    if (decoded.id !== adminId)
      throw new ForbiddenException('Ruxsat etilmagan foydalanuvchi');
    const admin = await this.adminService.findOne(adminId);
    if (!admin || !admin.hashedToken) {
      throw new BadRequestException('Admin topilmadi');
    }
    const tokenMatch = await bcrypt.compare(refreshToken, admin.hashedToken);
    if (!tokenMatch) {
      throw new ForbiddenException('Ruxsat etilmagan foydalanuvchi');
    }
    const tokens = await this.getTokens(admin);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.adminService.updateRefreshToken(admin.id, hashed_refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.REFRESH_COOKIE_TIME), //7 kun millisekunda
      httpOnly: true,
      secure: false, // https bo‘lsa true bo'ladi
      sameSite: 'lax',
    });
    const response = {
      id: admin._id,
      access_token: tokens.access_token,
    };
    console.log('access_token yangilandi');
    return response;
  }
}
