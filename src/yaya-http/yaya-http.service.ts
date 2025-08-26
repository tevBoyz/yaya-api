import { firstValueFrom } from "rxjs";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { SearchTransactionDto } from "src/transactions/dto/search-transaction-dto";
import { generateSignature } from "src/utils/signature";

@Injectable()
export class YayaHttpService {
  private readonly logger = new Logger(YayaHttpService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly useMock: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('YAYA_BASE_URL')?.replace(/\/+$/, '') || 'https://sandbox.yayawallet.com';
    this.apiKey = (this.config.get<string>('YAYA_API_KEY') || 'mock_key').trim();
    this.apiSecret = (this.config.get<string>('YAYA_API_SECRET') || 'mock_secret').trim();
  }

  //GET API Call to YaYa API
  async get(path: string, params: Record<string, any> = {}) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    
    const {signature, timestamp} = generateSignature(this.apiSecret, 'GET', fullPath, null);

    const headers = {
      'YAYA-API-KEY': this.apiKey,
      'YAYA-API-SIGN': signature,
      'YAYA-API-TIMESTAMP': timestamp,
    };

    try {
      this.logger.log(`[YayaHttpService] Real GET ${this.baseUrl}${fullPath}${JSON.stringify(params)}`);

      const response = await firstValueFrom(
        this.http.get(`${this.baseUrl}${fullPath}`, { headers, params}),
      );
      return (response as { data: any }).data;
    } catch (error) {
      this.logger.error(`Error calling YaYa API: ${error.message}`);
      throw error;
    }
  }

//POST Call to YaYa API
async post(path: string, queryDto: SearchTransactionDto) {
  const fullPath = path.startsWith('/') ? path : `/${path}`;

  const {signature, timestamp} = await generateSignature(this.apiSecret, 'POST', fullPath, queryDto);

  const headers = {
    'YAYA-API-KEY': this.apiKey,
    'YAYA-API-SIGN': signature,
    'YAYA-API-TIMESTAMP': timestamp,
  };

  try {
    this.logger.log(`[YayaHttpService] Real POST ${this.baseUrl}${fullPath}${JSON.stringify(queryDto)}`);
    const response = await firstValueFrom(
      this.http.post(`${this.baseUrl}${fullPath}`, queryDto, { headers }),
    );
    return (response as { data: any }).data;
  } catch (error) {
    this.logger.error(`Error calling YaYa API: ${error.message}`);
    throw error;
  }
}
}