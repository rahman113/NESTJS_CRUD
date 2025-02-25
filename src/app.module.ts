import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailService } from './mail/mail.service';


@Module({
  imports: [
    ConfigModule.forRoot() , //  Load .env file (Must be included only once)
    PrismaModule, 
    UserModule,   //  Include UserModule (which contains AuthModule)
  ],
  providers: [MailService],
})
export class AppModule {}