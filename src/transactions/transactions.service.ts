import { Injectable } from '@nestjs/common';
import { YayaHttpService } from 'src/yaya-http/yaya-http.service';
import { Transaction } from './interfaces/transaction.interface';
import { SearchTransactionDto } from './dto/search-transaction-dto';

@Injectable()
export class TransactionsService {
    constructor(private readonly yayaHttp: YayaHttpService) { }

    private transactions: Transaction[] = [
    {
      id: 'txn_001',
      sender: 'Abebe',
      receiver: 'Kebede',
      amount: 100,
      currency: 'ETB',
      cause: 'Payment',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'txn_002',
      sender: 'Mulu',
      receiver: 'Abebe',
      amount: 50,
      currency: 'ETB',
      cause: 'Refund',
      createdAt: new Date().toISOString(),
    },
  ];

    findByUser(userId: string, page: number) {
        return this.yayaHttp.get(`api/en/transactions/find-by-user`, {userId: userId, page: page});
    }

    async searchTransactions(queryDto: SearchTransactionDto): Promise<{ results: Transaction[] }> {

        return this.yayaHttp.post(`api/en/transactions/search`, queryDto);

}
}