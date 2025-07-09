import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { validationPipeOpts } from './common/validation/option.validation';
import { ENV_APP_KEY } from './config/app.config';
import { setupSwagger } from './swagger/setup.swagger';

import type { IEnvApp } from './config/app.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(validationPipeOpts));

  const appEnv = app.get(ConfigService<IEnvApp>).getOrThrow(ENV_APP_KEY, { infer: true });
  const baseUrl = `${appEnv.protocol}://${appEnv.host}:${appEnv.port}`;
  const apiVersionPath = `${appEnv.basePath}/v${appEnv.version}`;

  // Enable version for across application
  app
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: `${appEnv.version}`,
      prefix: 'v',
    })
    .setGlobalPrefix(appEnv.basePath);

  // Integrate Swagger
  setupSwagger(app);

  await app.listen(appEnv.port);

  Logger.log(`${baseUrl}/${apiVersionPath}`, 'Server');
  Logger.log(`${baseUrl}/${apiVersionPath}/${appEnv.swaggerResource}`, 'API Documentation');
}

void bootstrap();
