import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { RoleTypes } from 'src/role.decorator';

export class SignUpDto {
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @IsArray()
  @IsEnum(RoleTypes, { message: 'Please enter correcr role' })
  readonly roles?: RoleTypes[];

  @IsOptional()
  @IsString()
  readonly timezone?: string;

  @IsOptional()
  readonly createdAtTimestamp?: number;
}

export class SignInDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
