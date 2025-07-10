class JwtPayload {
  public iss: string;
  public iat: number;
  public exp: number;
}

export interface SwaggerValidationResult {
  sub: string;
}

export type SwaggerJwtPayload = JwtPayload & Partial<SwaggerValidationResult>;
