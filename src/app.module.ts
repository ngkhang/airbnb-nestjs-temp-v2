import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseExceptionFilter } from './common/exceptions/response-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import appConfig from './config/app.config';
import jwtConfig from './jwt/jwt.config';
import { SwaggerAuthModule } from './swagger/swagger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, jwtConfig],
      envFilePath: '.env',
      cache: true,
    }),
    SwaggerAuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
    { provide: APP_FILTER, useClass: ResponseExceptionFilter },
  ],
})
export class AppModule {}
