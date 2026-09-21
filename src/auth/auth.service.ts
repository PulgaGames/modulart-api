import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

/** Auth de estudio: un solo usuario (como un Identity local, no Identity Server). */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  login(dto: LoginDto) {
    const user = this.config.get<string>('ADMIN_USER', 'admin');
    const pass = this.config.get<string>('ADMIN_PASSWORD', 'admin');
    if (dto.username !== user || dto.password !== pass) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }
    return {
      accessToken: this.jwt.sign({ sub: 'admin', username: dto.username }),
      tokenType: 'Bearer',
      expiresIn: '8h',
    };
  }
}
