import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationError, ValidationPipe, Logger } from '@nestjs/common';
import { ResponseType } from './interfaces/responseType';
import { COMMON_RES_MESSAGES } from './constants/commonResMessage.constant';
import { getCorsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  
  // Enable CORS with environment-specific configuration
  const corsConfig = getCorsConfig();
  app.enableCors(corsConfig);
  
  // Log CORS configuration for debugging
  logger.log(`CORS enabled with origin: ${corsConfig.origin === true ? 'All origins' : corsConfig.origin}`);
  
  app.useGlobalPipes(new ValidationPipe(
    {
      exceptionFactory: (validationErrors: ValidationError[] = []) => {

        // mapping class-validator errors
        const error = validationErrors.map(err => {
          return {
            field: err.property,
            message: Object.values(err.constraints || ""),
          };
        });

        const res: ResponseType = {
          message: COMMON_RES_MESSAGES.VALIDATION_ERR,
          error
        };
        return new BadRequestException(res);
      },
    }
  ));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`🌐 CORS is enabled for all origins`);
}
bootstrap();
