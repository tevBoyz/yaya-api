import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('api/en/transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Get('find-by-user')
    async findByUser(@Query('userId') userId: string, @Query('page') page: number) {
        return this.transactionsService.findByUser(userId, page);
    }
}
