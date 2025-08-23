import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { YayaHttpModule } from 'src/yaya-http/yaya-http.module';

@Module({
  imports: [YayaHttpModule],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
