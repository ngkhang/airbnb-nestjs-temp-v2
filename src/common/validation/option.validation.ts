import type { ValidationError, ValidationPipeOptions } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

import { StructuredHttpException } from '../exceptions/detailed-error.exception';

import type { ErrorDetail } from '../types/error.type';

export const validationPipeOpts: ValidationPipeOptions = {
  stopAtFirstError: true,
  errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (validationErrors: ValidationError[]): void => {
    const errors: ErrorDetail[] = validationErrors.map(
      ({ constraints, property, value }: ValidationError): ErrorDetail => {
        return {
          code: 'VALIDATION_FAILED',
          message: constraints ? Object.values(constraints)[0] : 'Invalid value',
          field: property,
          value,
        };
      },
    );

    throw new StructuredHttpException(
      {
        message: 'Validation failed',
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  },
};
