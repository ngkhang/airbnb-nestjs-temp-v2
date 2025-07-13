import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { StructuredHttpException } from 'src/common/exceptions/detailed-error.exception';
import { ENV_JWT_KEY, IEnvJwt } from 'src/jwt/jwt.config';
import { SwaggerJwtPayload, SwaggerValidationResult } from 'src/jwt/jwt.type';

import { appTokenName } from './swagger.const';

@Injectable()
export class SwaggerJwtStrategy extends PassportStrategy(Strategy, 'swagger-jwt') {
  constructor(private readonly configService: ConfigService<IEnvJwt>) {
    const { secretKey, issuer } = configService.getOrThrow(ENV_JWT_KEY, { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromHeader(appTokenName),
      ignoreExpiration: false,
      secretOrKey: secretKey,
      issuer,
    });
  }

  public validate(payload: SwaggerJwtPayload): SwaggerValidationResult {
    if (!payload.sub) {
      throw new StructuredHttpException(
        {
          message: 'x-app-token is missing or incorrect sub property',
          errors: [
            {
              code: 'TOKEN_INCORRECT',
              message: 'Not found or incorrect sub property in x-app-token',
              field: appTokenName,
            },
          ],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      sub: payload.sub,
    };
  }
}
