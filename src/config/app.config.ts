import { registerAs } from '@nestjs/config';

import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

import { validateEnvironment } from 'src/common/validation/env.validation';

// Step 1: Define interface and key config
interface IAppConfig {
  nodeEnv: string;
  appName: string;
  protocol: string;
  host: string;
  port: number;
  version: number;
  basePath: string;
}

export const ENV_APP_KEY = 'ENV_APP_KEY';

export type IEnvApp = { [ENV_APP_KEY]: IAppConfig };

// Step 1.1: Define enum, if necessary
enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

enum AppProtocol {
  HTTP = 'http',
  HTTPS = 'https',
}

// Step 2: Define EnvVariable class + class-validator decorator
class EnvironmentVariables {
  @IsString()
  @IsEnum(Environment)
  public readonly NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  public readonly APP_NAME: string;

  @IsString()
  @IsEnum(AppProtocol)
  public readonly APP_PROTOCOL: string;

  @IsString()
  @IsNotEmpty()
  public readonly APP_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  public readonly APP_PORT: number;

  @IsNotEmpty()
  @Min(1)
  @IsInt()
  public readonly APP_VERSION: number;

  @IsString()
  @IsNotEmpty()
  public readonly APP_BASE_PATH: string;
}

// Step 3: Register environment variables with registerAs() + handle validation
export default registerAs(ENV_APP_KEY, (): IAppConfig => {
  const validatedConfig = validateEnvironment(EnvironmentVariables);

  return {
    nodeEnv: validatedConfig.NODE_ENV,
    appName: validatedConfig.APP_NAME,
    protocol: validatedConfig.APP_PROTOCOL,
    host: validatedConfig.APP_HOST,
    port: validatedConfig.APP_PORT,
    version: validatedConfig.APP_VERSION,
    basePath: validatedConfig.APP_BASE_PATH,
  };
});
