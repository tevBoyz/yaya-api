import { Injectable } from '@nestjs/common';
import { YayaHttpService } from 'src/yaya-http/yaya-http.service';
import { Transaction } from './interfaces/transaction.interface';
import { SearchTransactionDto } from './dto/search-transaction-dto';

@Injectable()
export class TransactionsService {
    constructor(private readonly yayaHttp: YayaHttpService) { }

    //GET /transactions/find-by-user?p=1 Endpoint service relays same endpoint on YaYa API with signature
    findByUser(page: number) {
        return this.yayaHttp.get(`api/en/transaction/find-by-user`, {p: page});
    }

    //POST /transactions/search Endpoint service relays same endpoint on YaYa API with signature
    async searchTransactions(queryDto: SearchTransactionDto): Promise<{ results: Transaction[] }> {
        return this.yayaHttp.post(`api/en/transaction/search`, queryDto);
}
}