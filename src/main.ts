import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,POST', // Allow only GET and POST methods
    credentials: true,
  }); 

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
