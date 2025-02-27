import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { payloadDto } from '../dto/credentials.dto';

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtSecret = this.configService.get<string>('jwtSecret')!;
    this.accessTokenSecret =
      this.configService.get<string>('accessTokenSecret')!;
    this.refreshTokenSecret =
      this.configService.get<string>('refreshTokenSecret')!;
  }

  generateAccessToken(payload: payloadDto) {
    return this.jwtService.sign(payload, {
      secret: this.accessTokenSecret,
      expiresIn: '1h',
    });
  }

  generateRefreshToken(payload: payloadDto) {
    return this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: '1d',
    });
  }

  onRefreshToken(token: string) {
    try {
      const decoded = this.verifyToken(token);
      const payload = { email: decoded.email, id: decoded.id } as payloadDto;
      return {
        accessToken: this.generateAccessToken(payload),
        refreshToken: this.generateRefreshToken(payload),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to refresh token');
    }
  }

  verifyToken(token: string): payloadDto {
    return this.jwtService.verify(token, {
      secret: this.refreshTokenSecret,
    });
  }

  validateToken(token: string): payloadDto {
    return this.jwtService.verify(token, {
      secret: this.accessTokenSecret,
    });
  }
}
