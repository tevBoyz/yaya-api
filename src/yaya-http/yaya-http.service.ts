import { firstValueFrom } from "rxjs";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";

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
    this.baseUrl = this.config.get<string>('YAYA_BASE_URL')?.replace(/\/+$/, '') || 'https://yayawallet.com';
    this.apiKey = this.config.get<string>('YAYA_API_KEY') || 'mock_key';
    this.apiSecret = this.config.get<string>('YAYA_API_SECRET') || 'mock_secret';
    this.useMock = this.config.get<string>('USE_MOCK') || 'true';
  }

  /**
   * Generic GET wrapper
   */
  async get(path: string, params: Record<string, any> = {}) {
    const fullPath = path.startsWith('/') ? path : `/${path}`;

    // 🔹 Mock mode
    if (this.useMock) {
      this.logger.log(`[YayaHttpService] Mock GET ${fullPath}`);
      console.log("david:" + " " + fullPath, params);
      return this.mockResponse(fullPath, params);
    }

    // 🔹 Real API logic
    const timestamp = Date.now().toString();
    const prehash = `${timestamp}GET${fullPath}${Object.keys(params).length ? JSON.stringify(params) : ''}`;
    const signature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(prehash)
      .digest('base64');

    const headers = {
      'YAYA-API-KEY': this.apiKey,
      'YAYA-SIGNATURE': signature,
      'YAYA-TIMESTAMP': timestamp,
    };

    try {
      this.logger.log(`[YayaHttpService] Real GET ${this.baseUrl}${fullPath}`);
      const response = await firstValueFrom(
        this.http.get(`${this.baseUrl}${fullPath}`, { params, headers }),
      );
      return (response as { data: any }).data;
    } catch (error) {
      this.logger.error(`Error calling YaYa API: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mock responses for now
   */
  private mockResponse(path: string, params: Record<string, any> = {}) {
    if (path.includes('/api/en/time')) {
      return {
        time: Date.now(),
        timezone: 'UTC',
        client_ip: '127.0.0.1',
      };
    }

    if (path.includes('/api/en/transactions/find-by-user')) {
      return {
        userId: params.userId,
        page: params.page,
        transactions: [
          { id: 't1', sender: 'Alice', receiver: 'Bob', amount: 50, currency: 'USD', cause: 'deposit', created_at: new Date().toISOString() },
          { id: 't2', sender: 'Bob', receiver: 'Alice', amount: 20, currency: 'USD', cause: 'withdrawal', created_at: new Date().toISOString() },
        ],
        currentPage: params.p || 1,
      };
    }

    if (path.includes('/api/en/transaction/search')) {
      return {
        results: [
          { id: 't3', sender: 'Charlie', receiver: 'Alice', amount: 75, currency: 'USD', cause: 'transfer', created_at: new Date().toISOString() },
        ],
      };
    }

    return { message: `Mock response for ${path}` };
  }
}
