import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';
import * as bcrypt from 'bcryptjs';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(
    @InjectModel('Users')
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signup(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { firstName, lastName, email, password } = signUpDto;
    const userExistance = await this.userModel.findOne({ email });
    if (userExistance) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id, role: user.roles });

    return { token };
  }
  async signin(signInDto: SignInDto): Promise<{ token: string }> {
    const { email, password } = signInDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(
        `Invalid email or password. Please check and try again.`,
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credential');
    }
    const token = this.jwtService.sign({
      id: user._id,
      role: user.roles,
    });

    return { token };
  }
}
