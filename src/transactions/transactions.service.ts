import { Injectable } from '@nestjs/common';
import { YayaHttpService } from 'src/yaya-http/yaya-http.service';
import { Transaction } from './interfaces/transaction.interface';
import { SearchTransactionDto } from './dto/search-transaction-dto';

@Injectable()
export class TransactionsService {
    constructor(private readonly yayaHttp: YayaHttpService) { }

    findByUser(userId: string, page: number) {
        return this.yayaHttp.get(`api/en/transactions/find-by-user`, {userId: userId, page: page});
    }

    async searchTransactions(queryDto: SearchTransactionDto): Promise<{ results: Transaction[] }> {
        return this.yayaHttp.post(`api/en/transactions/search`, queryDto);

}
}