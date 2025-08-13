import { Controller, Get, Post, Options } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string; cors: boolean } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      cors: true
    };
  }

  @Post('test-cors')
  testCors(): { message: string; cors: boolean } {
    return {
      message: 'CORS is working! This endpoint accepts POST requests from any origin.',
      cors: true
    };
  }

  @Options('test-cors')
  handleCorsPreflight() {
    // This handles the preflight OPTIONS request
    return { message: 'Preflight request handled' };
  }
}
