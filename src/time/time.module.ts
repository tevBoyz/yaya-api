import { Module } from '@nestjs/common';
import { TimeController } from './time.controller';
import { TimeService } from './time.service';
import { YayaHttpModule } from 'src/yaya-http/yaya-http.module';

@Module({
  imports: [YayaHttpModule],
  controllers: [TimeController],
  providers: [TimeService]
})
export class TimeModule {}
