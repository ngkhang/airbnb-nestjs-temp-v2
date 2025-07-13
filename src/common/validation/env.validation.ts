import { HttpStatus } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ErrorDetailDto } from '../dtos/error-detail.dto';
import { StructuredHttpException } from '../exceptions/detailed-error.exception';

import type { ClassConstructor } from 'class-transformer';

export const validateEnvironment = <T extends object>(EnvironmentVariables: ClassConstructor<T>): T => {
  const validatedEnvConfig = plainToInstance(EnvironmentVariables, process.env, {
    enableImplicitConversion: true,
  });

  const validationErrors = validateSync(validatedEnvConfig, {
    skipMissingProperties: false,
  });

  if (validationErrors.length > 0) {
    const errors = validationErrors.map(
      ({ constraints, property }) =>
        new ErrorDetailDto({
          code: 'VALIDATION_FAILED',
          message: constraints ? Object.values(constraints)[0] : toString(),
          field: property,
        }),
    );

    throw new StructuredHttpException(
      {
        message: 'Please check input',
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  return validatedEnvConfig;
};
