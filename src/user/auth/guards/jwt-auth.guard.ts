import { Injectable, CanActivate, ExecutionContext, UnauthorizedException  } from "@nestjs/common";
import { JwtService  } from "@nestjs/jwt";
import { Request  } from "express"



@Injectable()
export class JwtAuthGuard  implements CanActivate {
    constructor(private readonly  jwtService: JwtService)  {}
     canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request  = context.switchToHttp().getRequest<Request>();
        
        const authHeader =  request.headers['authorization'];
        console.log("authHeader----", authHeader);
        
        if(!authHeader){
            throw new UnauthorizedException("Authorized header is missing")
            
        }
        const token = authHeader.split(" ")[1];
        console.log("token---", token);
        
        if(!token){
            throw new UnauthorizedException("Token is missing");
        }
        try {
            const decoded = this.jwtService.verify(token)
            request["user"] = decoded;
            return true;
            
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
            
        }
     }
         
     }


