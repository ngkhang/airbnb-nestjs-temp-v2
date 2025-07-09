import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { validationPipeOpts } from './common/validation/option.validation';
import { ENV_APP_KEY } from './config/app.config';

import type { IEnvApp } from './config/app.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(validationPipeOpts));

  const appEnv = app.get(ConfigService<IEnvApp>).getOrThrow(ENV_APP_KEY, { infer: true });

  const baseUrl = `${appEnv.protocol}://${appEnv.host}:${appEnv.port}`;

  // Enable version for across application
  app
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: `${appEnv.version}`,
      prefix: 'v',
    })
    .setGlobalPrefix(appEnv.basePath);

  await app.listen(appEnv.port);

  Logger.log(`Application is running on: ${baseUrl}/${appEnv.basePath}/v${appEnv.version}`);
}

void bootstrap();
