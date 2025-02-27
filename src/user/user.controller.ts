import { Controller,Req, Get, Post, Body, Param, Patch, Delete, UseInterceptors,UploadedFile, UseGuards  } from '@nestjs/common';
import { UserService } from './user.service';
import {CreateUserDto} from "./dto/create-user.dto"
import {UpdateUserDto} from "./dto/update-user.dto"
import { Request, Response } from 'express';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { profilePictureUpload } from '../middleware/file-upload.middleware';
import { processProfilePicture } from '../middleware/image-processing.middleware';


interface AuthenticatedRequest extends Request {
    user?: { id: string }; // Modify based on your user object structure
  }
  
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    create(@Body() data: CreateUserDto) {
        return this.userService.createUser(data);
    }

    @Get()
    findAll() {
        return this.userService.getUsers();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard) //  Protect this route
    update(@Param('id') id: string, @Body() data:UpdateUserDto) {
        return this.userService.updateUser(id, data);
    }
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @Post('upload-profile-picture')
    @UseGuards(JwtAuthGuard)
  async uploadProfilePicture(@Req() req: AuthenticatedRequest, res: Response) {
    console.log("User from Request:", req.user);
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      try {
        await new Promise<void>((resolve, reject) => {
          profilePictureUpload(req, res, (err: any) => {
            if (err) return reject(err);
            resolve();
          });
        });
  
        await new Promise<void>((resolve, reject) => {
          processProfilePicture(req, res, (err: any) => {
            if (err) return reject(err);
            resolve();
          });
        });
  
        if (!req.file) {
          return res.status(400).json({ message: 'File upload failed' });
        }
  
        // Update user profile picture in DB
        const updatedUser = await this.userService.updateUserProfilePicture(req.user.id, req.file.filename);
  
        return {
          message: 'Profile picture uploaded successfully',
          profilePicture: updatedUser.data.profilePicture,
        };
      } catch (error) {
        return { message: 'Internal Server Error', error: error.message };
      }
    }
  }

    
    


