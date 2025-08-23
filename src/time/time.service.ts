import { Injectable } from '@nestjs/common';
import { YayaHttpService } from 'src/yaya-http/yaya-http.service';

@Injectable()
export class TimeService {
    constructor(private readonly yayaHttp: YayaHttpService) { }
    
    async getTime() {
        return this.yayaHttp.get('api/en/time');
    }
}
