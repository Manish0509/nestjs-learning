import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {
  CreateUserDto,
  IGetAllCustomerDataResponse,
  UpdateUserDto,
} from './dto/user.dto';
import { Query } from 'express-serve-static-core';

@Injectable({})
export class UserService {
  constructor(@InjectModel('Users') private userModel: Model<User>) {}

  async findAll(query: Query): Promise<IGetAllCustomerDataResponse> {
    try {
      const currentpage = Number(query.page);
      const limit = Number(query.limit) || 1;
      const skip = Number(currentpage * limit);
      // const sortField = Number(query.sortField) || 'createdAtTimestamp';
      // const sortType = Number(query.sortType) || 'desc';
      const keyword = query.searchTerm
        ? {
            $or: [
              { firstName: { $regex: query.searchTerm, $options: 'i' } },
              { email: { $regex: query.searchTerm, $options: 'i' } },
            ],
          }
        : {};
      const totalCount = await this.userModel.countDocuments({ ...keyword });
      const users = await this.userModel
        .find({ ...keyword })
        .limit(limit)
        .skip(skip);

      return {
        totalCount,
        data: users,
        page: currentpage,
      };
    } catch (err) {
      console.log('err:', err);
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  async createUser(user: CreateUserDto): Promise<User> {
    try {
      const userExistance = await this.userModel.findOne({ email: user.email });
      if (userExistance) {
        throw new ConflictException(`User with ${user.email} already exists`);
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const users = await this.userModel.create({
        ...user,
        password: hashedPassword,
      });
      return users;
    } catch (err) {
      // Re-throw if it's already an HTTP error (like NotFoundException)
      if (err instanceof HttpException) {
        throw err;
      }

      console.error('Unexpected error during user creation:', err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException(`User not found.`);
      }
      return user;
    } catch (err) {
      // Re-throw if it's already an HTTP error (like NotFoundException)
      if (err instanceof HttpException) {
        throw err;
      }

      console.log('err:', err);
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  async updateUserById(id: string, user: UpdateUserDto): Promise<User> {
    try {
      if (!id) {
        throw new NotFoundException(`Cannot find user Id.`);
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { ...user, updatedAtTimestamp: moment().unix() },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} does not exist`);
      }

      return updatedUser;
    } catch (err) {
      // Re-throw if it's already an HTTP error (like NotFoundException)
      if (err instanceof HttpException) {
        throw err;
      }

      console.error('Unexpected error during user update:', err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteUserById(id: string): Promise<any> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} does not exist`);
      }
      return {
        message: 'User deleted successfully',
      };
    } catch (err) {
      // Re-throw if it's already an HTTP error (like NotFoundException)
      if (err instanceof HttpException) {
        throw err;
      }

      console.error('Unexpected error during user delete:', err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
