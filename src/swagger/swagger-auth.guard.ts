import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { StructuredHttpException } from 'src/common/exceptions/detailed-error.exception';

import { appTokenName } from './swagger.const';

class RequestInfo {
  public name: string;
  public message: string;
}

@Injectable()
export class SwaggerAuthGuard extends AuthGuard('swagger-jwt') {
  constructor() {
    super();
  }

  public handleRequest<TUser = any>(err: any, user: TUser, info: any): TUser {
    if (err) throw err;

    if (typeof info === 'object' || info instanceof RequestInfo) {
      const { code, message } = this.mapJwtError(info as object);

      throw new StructuredHttpException(
        {
          message: 'UnAuthorized',
          errors: [
            {
              code,
              message,
              field: appTokenName,
            },
          ],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  private mapJwtError(info: RequestInfo | object): { code: string; message: string } {
    if (Object.keys(info).length === 0) {
      return {
        code: 'TOKEN_MISSING',
        message: 'No auth token',
      };
    }

    if ('name' in info && info.name === 'TokenExpiredError') {
      return {
        code: 'TOKEN_EXPIRED',
        message: `The ${appTokenName} has expired`,
      };
    }

    const errorDetail = {
      code: 'TOKEN_INVALID_OR_INCORRECT',
      message: `The ${appTokenName} invalid`,
    };

    if ('name' in info && info.name === 'JsonWebTokenError') {
      switch (info.message.replace(/\..+/g, '')) {
        case 'invalid signature':
          errorDetail.message = `The ${appTokenName} invalid signature`;
          break;
        case 'jwt issuer invalid':
          errorDetail.message = `The issuer in ${appTokenName} invalid`;
          break;
        case 'jwt malformed':
          errorDetail.message = `The ${appTokenName} does not have three components`;
          break;
        case 'invalid token':
          errorDetail.message = `The header or payload in ${appTokenName} could not be parsed`;
          break;
      }
    }
    return errorDetail;
  }
}
