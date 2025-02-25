import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "../dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { MailService } from '../../mail/mail.service'; // ✅ Import MailService

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService, //  Inject ConfigService
        private mailService: MailService 
    ) { }

    async login(data: LoginDto) {
        const user = await this.prisma.users.findUnique({
            where: { email: data.email }
        })
        if (!user) {
            throw new UnauthorizedException('Invalid email or password')
        }
        const isValidPassword = await bcrypt.compare(data.password, user.password)
        if (!isValidPassword) {
            throw new UnauthorizedException('Invalid email or password')
        }

        // Generate JWT token (expires in 24 hours)
        //  Get secret and expiry from .env
        const secret = this.configService.get<string>('JWT_SECRET');
        console.log("secret", secret);

        //  Get secret and expiry from .env
        const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '24h');
        console.log("expiresIn", expiresIn);

        const token = this.jwtService.sign(
            { userId: user.id },
            { secret, expiresIn });
        return {
            "message": "login successfull",
            "token": token,
            data: {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }
    }

    // Forgot Password: Generate a token and send via email

    async forgotPassword(email: string) {
        const user = await this.prisma.users.findUnique({
            where: { email }
        })
        console.log("user", user);
        
        if (!user) {
            throw new BadRequestException('User not found')
        }
        const resetToken = this.jwtService.sign({ userId: user.id },
            {
                secret: this.configService.get<string>("JWT_SECRET"), expiresIn: "15m"
            })
        // Send email with the token
        await this.mailService.sendPasswordResetEmail(email, resetToken);

        return { message: 'Password reset email sent!' };

    }
    async resetPassword(token: string, newPassword: string) {
        try {
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
    
            const user = await this.prisma.users.findUnique({ where: { id: decoded.userId } });
            if (!user) throw new BadRequestException('Invalid token or user not found');
    
            const hashedPassword = await bcrypt.hash(newPassword, 10);
    
            await this.prisma.users.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });
    
            return { message: 'Password reset successful' };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
    
}