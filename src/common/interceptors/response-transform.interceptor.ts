import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

import { ApiSuccessResponseDto } from '../dtos/api-response.dto';
import { ControllerResponse } from '../types/returns.type';

@Injectable()
export class ResponseTransformInterceptor<TData>
  implements NestInterceptor<ControllerResponse<TData>, ApiSuccessResponseDto<TData>>
{
  public intercept(
    context: ExecutionContext,
    next: CallHandler<ControllerResponse<TData>>,
  ): Observable<ApiSuccessResponseDto<TData>> {
    const http = context.switchToHttp();
    const res = http.getResponse<Response>();
    const req = http.getRequest<Request>();

    return next.handle().pipe(
      map(
        ({ data, message }): ApiSuccessResponseDto<TData> =>
          new ApiSuccessResponseDto({
            message,
            data,
            statusCode: res.statusCode,
            requestPath: req.url,
            timestamp: new Date().toISOString(),
          }),
      ),
    );
  }
}
