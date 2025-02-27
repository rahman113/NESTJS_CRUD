import {IsEmail,IsString, MinLength, Matches } from "class-validator"



export class CreateUserDto {
    @IsString()
  name: string; 
    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).*$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      })
    password: string

    profilePicture?: string;
}