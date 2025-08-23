import { Injectable } from '@nestjs/common';
import { YayaHttpService } from 'src/yaya-http/yaya-http.service';

@Injectable()
export class TransactionsService {
    constructor(private readonly yayaHttp: YayaHttpService) { }

    findByUser(userId: string, page: number) {
        return this.yayaHttp.get(`api/en/transactions/find-by-user`, {userId: userId, page: page});
    }
}
