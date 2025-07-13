import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

import { Request, Response } from 'express';

import { ApiErrorResponseDto } from '../dtos/api-response.dto';
import { ErrorDetailResponse } from '../types/error.type';

import { StructuredHttpException } from './detailed-error.exception';

@Catch(HttpException)
export class ResponseExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const res = http.getResponse<Response<ApiErrorResponseDto>>();
    const req = http.getRequest<Request>();

    const statusCode = exception.getStatus();

    const { message, errors } = this.extractErrorDetails(exception);

    const jsonResponse = new ApiErrorResponseDto({
      statusCode,
      message,
      errors,
      requestPath: req.url,
      timestamp: new Date().toISOString(),
    });

    res.status(statusCode).json(jsonResponse);
  }

  private extractErrorDetails(exception: HttpException): ErrorDetailResponse {
    // Case 1: Handle exception with StructuredHttpException
    if (exception instanceof StructuredHttpException) {
      return exception.getResponse();
    }

    const exceptionResponse = exception.getResponse();

    // Case 2: Handle exception with HttpException(message, statusCode)
    if (typeof exceptionResponse === 'string') {
      return {
        message: exceptionResponse,
        errors: [],
      };
    }

    // Case 3: Handle exception with other case
    return {
      message: 'Internal server error',
      errors: [],
    };
  }
}
