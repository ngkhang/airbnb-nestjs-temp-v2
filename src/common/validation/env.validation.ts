import { HttpException, HttpStatus } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import type { ClassConstructor } from 'class-transformer';

class ErrorDetail {
  constructor(
    public code: string,
    public message: string,
    public field?: string,
    public value?: any,
  ) {}
}

export const validateEnvironment = <T extends object>(EnvironmentVariables: ClassConstructor<T>): T => {
  const validatedEnvConfig = plainToInstance(EnvironmentVariables, process.env, {
    enableImplicitConversion: true,
  });

  const validationErrors = validateSync(validatedEnvConfig, {
    skipMissingProperties: false,
  });

  if (validationErrors.length > 0) {
    const errors = validationErrors.map(
      (error) =>
        new ErrorDetail(
          'VALIDATION_FAILED',
          error.constraints ? Object.values(error.constraints)[0] : error.toString(),
        ),
    );

    throw new HttpException(
      {
        message: 'Please check input',
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  return validatedEnvConfig;
};
