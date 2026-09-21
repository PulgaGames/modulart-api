import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'health', version: '1' })
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'modulart-api',
      timestamp: new Date().toISOString(),
    };
  }
}
