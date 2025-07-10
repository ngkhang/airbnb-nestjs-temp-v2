import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SwaggerModule } from '@nestjs/swagger';

import { ENV_JWT_KEY, IEnvJwt } from 'src/jwt/jwt.config';

import { SwaggerAuthGuard } from './swagger-auth.guard';
import { SwaggerJwtStrategy } from './swagger-jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IEnvJwt>) => {
        const { issuer, secretKey, appExpiredAt } = configService.getOrThrow(ENV_JWT_KEY, { infer: true });
        return {
          secret: secretKey,
          verifyOptions: {
            issuer,
            expiresIn: appExpiredAt,
          },
          signOptions: { issuer, expiresIn: appExpiredAt },
        };
      },
      inject: [ConfigService],
    }),
    SwaggerModule,
  ],
  providers: [
    SwaggerJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: SwaggerAuthGuard,
    },
  ],
  exports: [],
})
export class SwaggerAuthModule {}
