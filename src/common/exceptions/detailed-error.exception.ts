import type { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

import type { ErrorDetailResponse } from '../types/error.type';

export class StructuredHttpException extends HttpException {
  constructor(response: ErrorDetailResponse, status: HttpStatus) {
    super(response, status);
  }

  public getResponse(): ErrorDetailResponse {
    return super.getResponse() as ErrorDetailResponse;
  }
}
