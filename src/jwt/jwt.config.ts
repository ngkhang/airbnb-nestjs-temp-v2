import { registerAs } from '@nestjs/config';

import { IsNotEmpty, IsString } from 'class-validator';

import { validateEnvironment } from 'src/common/validation/env.validation';

import type ms from 'ms';

interface JwtConfig {
  issuer: string;
  secretKey: string;
  appExpiredAt: ms.StringValue;
}

export const ENV_JWT_KEY = 'ENV_JWT_KEY';

export type IEnvJwt = { [ENV_JWT_KEY]: JwtConfig };

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  public JWT_ISSUER: string;

  @IsString()
  @IsNotEmpty()
  public JWT_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  public JWT_APP_EXPIRES_IN: ms.StringValue;
}

export default registerAs(ENV_JWT_KEY, (): JwtConfig => {
  const validatedConfig = validateEnvironment(EnvironmentVariables);

  return {
    issuer: validatedConfig.JWT_ISSUER,
    secretKey: validatedConfig.JWT_SECRET_KEY,
    appExpiredAt: validatedConfig.JWT_APP_EXPIRES_IN,
  };
});
