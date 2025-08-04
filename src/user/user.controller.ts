import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.model';
import {
  CreateUserDto,
  IGetAllCustomerDataResponse,
  UpdateUserDto,
} from './dto/user.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RoleTypes } from 'src/role.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(
    @Query() query: ExpressQuery,
  ): Promise<IGetAllCustomerDataResponse> {
    return await this.userService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.createUser(user);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return await this.userService.findById(id);
  }

  @Put(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUserById(id, user);
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: string): Promise<any> {
    return await this.userService.deleteUserById(id);
  }
}
