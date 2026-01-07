import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3001;
  process.env.TZ = 'Asia/Tashkent';

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://oliy-kimyo-erp-frontend-7s97.vercel.app/',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cookieParser());

  const options = new DocumentBuilder()
    .setTitle('Sales Management System')
    .setDescription('Sales Management System')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-swagger', app, document);

  await app.listen(PORT, async () => {
    console.log(`http://localhost:${PORT}/api-swagger`);
  });
}
bootstrap();
