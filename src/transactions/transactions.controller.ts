import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { SearchTransactionDto } from './dto/search-transaction-dto';
import { Transaction} from './interfaces/transaction.interface';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    //GET /transactions/find-by-user?p=1 Endpoint
    @Get('find-by-user')
    async findByUser(@Query('p') p: number) {
        return this.transactionsService.findByUser(p);
    }

    //POST /transactions/search Endpoint
    @Post('search')
    searchTransactions(@Body() queryDto: SearchTransactionDto): Promise<{ results: Transaction[] }> {
        return this.transactionsService.searchTransactions(queryDto);
    }

}
