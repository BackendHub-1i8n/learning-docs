import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { CredentialsDto, payloadDto } from './dto/credentials.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  signIn(@Request() req: { user: CredentialsDto }) {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Bad Request',
          message:
            error instanceof Error ? error.message : 'Failed to login user',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/register')
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      const userExist = await this.authService.validateUser(
        createUserDto.email,
      );
      if (userExist) {
        throw new HttpException(
          {
            error: 'Bad Request',
            message: 'User already exist',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const data = await this.authService.register(createUserDto);
      if (!data) {
        throw new HttpException(
          {
            error: 'Bad Request',
            message: 'Failed to create user',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      return HttpStatus.CREATED;
    } catch (error) {
      throw new HttpException(
        {
          error: 'Bad Request',
          message:
            error instanceof Error ? error.message : 'Failed to create user',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/logout')
  logout(@Request() req: { logout: (cb: (err: Error) => void) => void }) {
    try {
      return req.logout((err) => {
        if (err) {
          throw new HttpException(
            {
              error: 'Bad Request',
              message: err instanceof Error ? err.message : 'Failed to logout',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        return HttpStatus.OK;
      });
    } catch (error) {
      throw new HttpException(
        {
          error: 'Bad Request',
          message: error instanceof Error ? error.message : 'Failed to logout',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req: { user: payloadDto }) {
    try {
      const { email } = req.user;
      const data = await this.authService.getProfile(email);
      return data;
    } catch (error) {
      throw new HttpException(
        {
          error: 'Bad Request',
          message:
            error instanceof Error ? error.message : 'Failed to get profile',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
