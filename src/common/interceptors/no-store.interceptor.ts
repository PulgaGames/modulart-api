import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class NoStoreInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<{ path?: string }>();
    const res = context.switchToHttp().getResponse<{ setHeader: (k: string, v: string) => void }>();
    const path = req.path || '';
    if (!path.includes('/media/')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    }
    return next.handle();
  }
}
