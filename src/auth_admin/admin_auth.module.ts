import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin_auth.service';
import { AdminAuthController } from './admin_auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module';
import type ms from 'ms';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.ADMIN_ACCESS_TOKEN_KEY,
      signOptions: { expiresIn: (process.env.ACCESS_TOKEN_TIME as ms.StringValue) },
    }),
    AdminModule,
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
