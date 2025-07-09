import type { ValidationError, ValidationPipeOptions } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

class ErrorDetail {
  constructor(
    public code: string,
    public message: string,
    public field?: string,
    public value?: any,
  ) {}
}

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
      ({ constraints, property, value }: ValidationError) =>
        new ErrorDetail('VALIDATION_FAILED', constraints ? Object.values(constraints)[0] : '', property, value),
    );

    throw new HttpException({ message: 'Please check input', errors }, HttpStatus.BAD_REQUEST);
  },
};
