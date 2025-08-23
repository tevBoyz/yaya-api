import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimeModule } from './time/time.module';
import { TransactionsModule } from './transactions/transactions.module';
import { YayaHttpModule } from './yaya-http/yaya-http.module';

@Module({
  imports: [TimeModule, TransactionsModule, YayaHttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
