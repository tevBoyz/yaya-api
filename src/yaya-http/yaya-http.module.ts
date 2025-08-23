import { Module } from '@nestjs/common';
import {HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { YayaHttpService } from './yaya-http.service';

@Module({
  imports: [ConfigModule,
     HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
     })],
  providers: [YayaHttpService],
  exports: [YayaHttpService],
})
export class YayaHttpModule {}
