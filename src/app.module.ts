import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './user/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot() , // ✅ Load .env file (Must be included only once)
    PrismaModule, 
    UserModule,   // ✅ Include UserModule (which contains AuthModule)
  ],
})
export class AppModule {}
