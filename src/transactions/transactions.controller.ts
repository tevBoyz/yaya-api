import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { SearchTransactionDto } from './dto/search-transaction-dto';
import { Transaction} from './interfaces/transaction.interface';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Get('find-by-user')
    async findByUser(@Query('userId') userId: string, @Query('page') page: number) {
        return this.transactionsService.findByUser(userId, page);
    }

    @Post('search')
    searchTransactions(@Body() queryDto: SearchTransactionDto): Promise<{ results: Transaction[] }> {
        return this.transactionsService.searchTransactions(queryDto);
    }

}
