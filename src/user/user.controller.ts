import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';

import {CreateUserDto} from "./dto/create-user.dto"
import {UpdateUserDto} from "./dto/update-user.dto"
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';  

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
    @UseGuards(JwtAuthGuard) // ✅ Protect this route
    update(@Param('id') id: string, @Body() data:UpdateUserDto) {
        return this.userService.updateUser(id, data);
    }
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

}
