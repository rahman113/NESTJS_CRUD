import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    ConfigModule, // ✅ Import ConfigModule to use .env variables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({  

        secret: configService.get<string>('JWT_SECRET'), // ✅ Load secret from .env
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
          
          
        },
         // ✅ Default to 24h
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService, JwtModule]    // ✅ Export AuthService for use in UserModule
})
export class AuthModule {}
