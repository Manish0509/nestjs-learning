import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoleTypes } from 'src/role.decorator';
import { User } from '../models/user.model';

export class CreateUserDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  readonly phone: string;
  readonly password: string;

  @IsOptional()
  @IsEnum(RoleTypes, { message: 'Please enter correct Role' })
  readonly roles: RoleTypes;

  @IsOptional()
  readonly createdAtTimestamp: string;

  @IsOptional()
  readonly updatedAtTimestamp: string;

  @IsOptional()
  readonly timezone: string;

  @IsOptional()
  @IsBoolean()
  readonly emailVerified: boolean;
}
export class UpdateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly roles: RoleTypes;
  readonly updatedAtTimestamp: string;
  readonly timezone: string;
  readonly emailVerified: boolean;
}

export interface IGetAllCustomerDataResponse {
  page: number;
  data: User[];
  totalCount: number;
}
