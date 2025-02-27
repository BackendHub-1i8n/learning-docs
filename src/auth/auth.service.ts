import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CredentialsDto, payloadDto } from './dto/credentials.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password?: string) {
    const user = await this.userService.findByEmail(email);
    let isValid = false;
    if (password) {
      isValid = await this.userService.comparePassword(password, user.password);
    }

    if (user && isValid) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  login(user: CredentialsDto) {
    try {
      const payload = { email: user.email, id: user.id } as payloadDto;
      return {
        access_token: this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
        }),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to login user');
    }
  }

  getProfile(email: string) {
    return this.userService.getProfile(email);
  }

  register(user: CreateUserDto) {
    return this.userService.create(user);
  }
}
