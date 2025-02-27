import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // console.log(configService);
  const PORT = configService.get<string>('port')!;
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // const config = new DocumentBuilder()
  //   .setTitle('Api Weather App')
  //   .setDescription('This is a weather api documentation')
  //   .setVersion('1.0')
  //   .addTag('auth')
  //   .addTag('statistic')
  //   .addBearerAuth()
  //   .addApiKey({ type: 'apiKey', name: 'apiKey', in: 'header' })
  //   .build();
  // const documentFactory = () => SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: configService.get<string>('sessionSecret')!,
      resave: false,
      saveUninitialized: false,
      store: new session.MemoryStore(),
    }),
  );
  await app.listen(PORT);
  logger.log(`Server running on http://localhost:${PORT}`);
}
bootstrap().catch((err) => {
  console.error(err);
});
