import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

type AuthedRequest = Request & { user?: { sub: string; username: string } };

/** Equivale a [Authorize] en ASP.NET. */
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const header = req.headers.authorization ?? '';
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Falta el token. Inicia sesión.');
    }
    try {
      req.user = this.jwt.verify<{ sub: string; username: string }>(token);
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o vencido');
    }
  }
}
