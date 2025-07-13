import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { ErrorDetailDto } from './error-detail.dto';

@ApiSchema({
  description: 'Base response structure',
})
class BaseResponseDto<TData> {
  @ApiProperty({
    type: Boolean,
    description: 'Indicates if the request was successful',
  })
  public isSuccess: boolean;

  @ApiProperty({
    type: Number,
    description: 'HTTP status code',
  })
  public statusCode: number;

  @ApiProperty({
    type: String,
    description: 'Response message',
  })
  public message: string;

  @ApiProperty({
    type: Object,
    description: 'The response data payload',
  })
  public data: TData;

  @ApiProperty({
    type: String,
    description: 'Request path that generated this response',
  })
  public requestPath: string;

  @ApiProperty({
    type: String,
    description: 'Response timestamp in ISO format',
  })
  public timestamp: string;

  constructor(payload: BaseResponseDto<TData>) {
    this.statusCode = payload.statusCode;
    this.message = payload.message;
    this.data = payload.data;
    this.requestPath = payload.requestPath;
    this.timestamp = payload.timestamp;
  }
}

@ApiSchema({
  description: 'The success API response DTO',
})
export class ApiSuccessResponseDto<TData> extends BaseResponseDto<TData> {
  constructor(payload: Omit<ApiSuccessResponseDto<TData>, 'isSuccess'>) {
    super({
      isSuccess: true,
      ...payload,
    });
  }
}

@ApiSchema({
  description: 'The error API response DTO',
})
export class ApiErrorResponseDto extends BaseResponseDto<null> {
  @ApiProperty({
    type: () => ErrorDetailDto,
    isArray: true,
    description: 'Error details',
  })
  public errors: ErrorDetailDto[];

  constructor(payload: Omit<ApiErrorResponseDto, 'isSuccess' | 'data'>) {
    super({
      isSuccess: false,
      data: null,
      ...payload,
    });
    this.errors = payload.errors.map((error) => new ErrorDetailDto(error));
  }
}
