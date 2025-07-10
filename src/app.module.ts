import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  providers: [AppService],
})
export class AppModule {}
