import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { OpenAPIObject } from '@nestjs/swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ENV_APP_KEY } from 'src/config/app.config';

import { appTokenName } from './swagger.const';

import type { IEnvApp } from 'src/config/app.config';

export const setupSwagger = (app: INestApplication): void => {
  const { version, swaggerResource } = app.get(ConfigService<IEnvApp>).getOrThrow(ENV_APP_KEY, { infer: true });

  const config = new DocumentBuilder()
    .setTitle('Airbnb API')
    .setDescription(
      'REST API for an Airbnb-like platform that enables users to list, discover, and book unique accommodations around the world.',
    )
    .addBearerAuth(
      {
        type: 'apiKey',
        scheme: 'Bearer',
        in: 'header',
        name: appTokenName,
        description: 'Application token is required for all endpoints',
      },
      appTokenName,
    )
    .setVersion(`${version}`)
    .build();

  const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`v${version}/${swaggerResource}`, app, documentFactory, {
    useGlobalPrefix: true,
    customSiteTitle: 'Airbnb Documentation',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
