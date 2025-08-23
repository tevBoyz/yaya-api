import { Controller, Get } from '@nestjs/common';
import { TimeService } from './time.service';

@Controller('api/en/time')
export class TimeController {
    constructor(private readonly timeService: TimeService) { }

    @Get()
    getTime(){
        return this.timeService.getTime();
    }
}
