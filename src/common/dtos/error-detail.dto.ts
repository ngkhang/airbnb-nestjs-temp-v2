import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'The error detail object',
})
export class ErrorDetailDto {
  @ApiProperty({
    description: 'Error code identifier',
  })
  public code: string;

  @ApiProperty({
    type: String,
    description: 'Error message description',
  })
  public message: string;

  @ApiPropertyOptional({
    nullable: true,
    type: String,
    description: 'Field that caused the error',
  })
  public field?: string;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Value that caused the error',
  })
  public value?: unknown;

  constructor(payloadDto: ErrorDetailDto) {
    this.code = payloadDto.code;
    this.message = payloadDto.message;
    this.field = payloadDto.field;
    this.value = payloadDto.value;
  }
}
