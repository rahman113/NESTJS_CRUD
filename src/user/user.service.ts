import { ConflictException, Injectable, NotFoundException  } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async createUser(data: Prisma.usersCreateInput) {
       // check if the user already exist(Assuming the email is unique)
       const existingUser = await this.prisma.users.findUnique({
        where: {email: data.email}
       })
       if(existingUser) {
        throw new ConflictException('User already exist')
       }
       if(!data.password) {
        throw new ConflictException('Password is required')
       }
       const hashedPassword: string = await bcrypt.hash(data.password, 10)
       // create new  user
       const newUser = await this.prisma.users.create({
        data: {
            ...data,
            password: hashedPassword
        }

        })
       return {
        success: true,
        message: 'User registered successfully',
        data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
       }
    }
    // login user
    async getUsers() {
        const allUsers = await this.prisma.users.findMany();
        const totalUsers = await this.prisma.users.count();
        if(!allUsers) {
            throw new NotFoundException('No users found');
        }
        return {
            success: true,
            message: "all users fetched successfully",
            data: allUsers,
            counts: totalUsers
        }
    }

    async getUserById(id: string) {
        const user = await this.prisma.users.findUnique({ where: { id } });
    
        console.log("Fetched User:", user); // Check what is actually returned
    
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    
        return {
            success: true,
            message: "User fetched successfully",
            data: user
        };
    }
    

    async updateUser(id: string, data: Prisma.usersUpdateInput) {
         // Check if the user exists before updating
         const existingUser = await this.prisma.users.findUnique({
            where: { id },
        })
        if (!existingUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        const updateUser = await  this.prisma.users.update({ where: { id }, data });
        return {
            sucess: true,
            message: 'User updated successfully',
            updateUser
        }
    }

    async deleteUser(id: string) {
        const user = await this.prisma.users.findUnique({ where: { id } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        await this.prisma.users.delete({ where: { id } });
      
        return {
          success: true,
          message: 'User deleted successfully',
        };
      }

      async updateUserProfilePicture(userId: string, filename: string) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }   
        const updatedUser = await this.prisma.users.update({
            where: { id: userId },
            data: { profilePicture: filename },
        });
    
        return {
            success: true,
            message: "Profile picture updated successfully",
            data: updatedUser,
        }; 
    }

}