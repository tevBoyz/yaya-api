import { Injectable } from '@nestjs/common';
import { YayaHttpService } from 'src/yaya-http/yaya-http.service';

@Injectable()
export class TimeService {
    constructor(private readonly yayaHttp: YayaHttpService) { }
    
    //service for GET /time endpoint relays same endpoint on YaYa API
    async getTime() {
        return this.yayaHttp.get('api/en/time');
    }
}
