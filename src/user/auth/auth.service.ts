import { Injectable, UnauthorizedException } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "../dto/login.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
         private jwtService: JwtService,
         private configService: ConfigService // ✅ Inject ConfigService
        )  {}

    async login(data: LoginDto) {
        const user = await this.prisma.users.findUnique({
            where: {email: data.email}
        })
        if (!user) {
            throw new UnauthorizedException('Invalid email or password')
        }
        const isValidPassword = await bcrypt.compare(data.password, user.password)
        if(!isValidPassword) {
            throw new UnauthorizedException('Invalid email or password')
        }

          // Generate JWT token (expires in 24 hours)
           // ✅ Get secret and expiry from .env
        const secret = this.configService.get<string>('JWT_SECRET');
        console.log("secret", secret);
        
         // ✅ Get secret and expiry from .env
        const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '24h');
        console.log("expiresIn", expiresIn);
        
          const token = this.jwtService.sign(
            { userId: user.id },
            { secret, expiresIn});
    return { token };
    }
}