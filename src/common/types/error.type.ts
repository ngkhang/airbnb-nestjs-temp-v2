export interface ErrorDetail {
  code: string;
  message: string;
  field?: string;
  value?: unknown;
}

export class ErrorDetailResponse {
  public message: string;
  public errors: ErrorDetail[];
}
