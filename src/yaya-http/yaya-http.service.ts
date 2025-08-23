import { firstValueFrom } from "rxjs";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { SearchTransactionDto } from "src/transactions/dto/search-transaction-dto";

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
 * Generic POST wrapper
 */
async post(path: string, queryDto: SearchTransactionDto) {
  const fullPath = path.startsWith('/') ? path : `/${path}`;

  // 🔹 Mock mode
  if (this.useMock === 'true') {
    this.logger.log(`[YayaHttpService] Mock POST ${fullPath}`);
    return this.mockPostResponse(fullPath, queryDto);
  }

  // 🔹 Real API logic
  const timestamp = Date.now().toString();
  const prehash = `${timestamp}POST${fullPath}${queryDto ? JSON.stringify(queryDto) : ''}`;
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
    this.logger.log(`[YayaHttpService] Real POST ${this.baseUrl}${fullPath}`);
    const response = await firstValueFrom(
      this.http.post(`${this.baseUrl}${fullPath}`, queryDto, { headers }),
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
  { id: 't1', sender: 'Abebe', receiver: 'Bob', amount: 50, currency: 'USD', cause: 'deposit', created_at: 1705314180000 },  // Jan 15 2024
  { id: 't2', sender: 'Bob', receiver: 'Alice', amount: 20, currency: 'USD', cause: 'withdrawal', created_at: 1709393100000 }, // Mar 2 2024
  { id: 't3', sender: 'Charlie', receiver: 'Alice', amount: 75, currency: 'USD', cause: 'transfer', created_at: 1699693920000 }, // Nov 11 2023
  { id: 't4', sender: 'Abebe', receiver: 'Kebede', amount: 100, currency: 'ETB', cause: 'payment', created_at: 1716226200000 }, // May 20 2024
  { id: 't5', sender: 'Liya', receiver: 'Abebe', amount: 200, currency: 'USD', cause: 'transfer', created_at: 1695633600000 }, // Sep 25 2023
  { id: 't6', sender: 'Alice', receiver: 'Alice', amount: 150, currency: 'USD', cause: 'top-up', created_at: 1719858000000 }, // Jul 1 2024
  { id: 't7', sender: 'Dawit', receiver: 'Charlie', amount: 300, currency: 'ETB', cause: 'deposit', created_at: 1702200300000 }, // Dec 10 2023
  { id: 't8', sender: 'Kebede', receiver: 'Alice', amount: 90, currency: 'USD', cause: 'payment', created_at: 1708285800000 }, // Feb 18 2024
  { id: 't9', sender: 'Alice', receiver: 'Bob', amount: 120, currency: 'USD', cause: 'transfer', created_at: 1718343900000 }, // Jun 14 2024
  { id: 't10', sender: 'Charlie', receiver: 'Charlie', amount: 250, currency: 'ETB', cause: 'top-up', created_at: 1693390200000 }, // Aug 30 2023
  { id: 't11', sender: 'Bob', receiver: 'Dawit', amount: 80, currency: 'USD', cause: 'withdrawal', created_at: 1712501100000 }, // Apr 7 2024
  { id: 't12', sender: 'Abebe', receiver: 'Liya', amount: 60, currency: 'USD', cause: 'payment', created_at: 1697700900000 }, // Oct 19 2023
  { id: 't13', sender: 'Liya', receiver: 'Alice', amount: 110, currency: 'EUR', cause: 'deposit', created_at: 1715451300000 }, // May 11 2024
  { id: 't14', sender: 'Charlie', receiver: 'Kebede', amount: 70, currency: 'USD', cause: 'withdrawal', created_at: 1706550600000 }, // Jan 29 2024
  { id: 't15', sender: 'Alice', receiver: 'Dawit', amount: 95, currency: 'USD', cause: 'transfer', created_at: 1690014900000 }, // Jul 22 2023
  { id: 't16', sender: 'Dawit', receiver: 'Liya', amount: 130, currency: 'ETB', cause: 'payment', created_at: 1717439400000 }, // Jun 3 2024
  { id: 't17', sender: 'Abebe', receiver: 'Abebe', amount: 220, currency: 'USD', cause: 'top-up', created_at: 1694078400000 }, // Sep 7 2023
  { id: 't18', sender: 'Bob', receiver: 'Charlie', amount: 75, currency: 'EUR', cause: 'deposit', created_at: 1708856100000 }, // Feb 25 2024
  { id: 't19', sender: 'Kebede', receiver: 'Abebe', amount: 140, currency: 'USD', cause: 'transfer', created_at: 1701337200000 }, // Nov 30 2023
  { id: 't20', sender: 'Liya', receiver: 'Dawit', amount: 160, currency: 'USD', cause: 'withdrawal', created_at: 1721381100000 }  // Jul 19 2024
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


  /**
 * Mock responses for POST requests
 */
// private mockPostResponse(path: string, body: Record<string, any> = {}) {
private mockPostResponse(path: string, queryDto: SearchTransactionDto) {
  if (path.includes('/api/en/transactions/search')) {
    const q = queryDto.query;
    console.log("q", q);
    const query = q.toLowerCase();
    console.log("query", query);
    const allTransactions = [
  { id: 't1', sender: 'Abebe', receiver: 'Bob', amount: 50, currency: 'USD', cause: 'deposit', created_at: 1705314180000 },  // Jan 15 2024
  { id: 't2', sender: 'Bob', receiver: 'Alice', amount: 20, currency: 'USD', cause: 'withdrawal', created_at: 1709393100000 }, // Mar 2 2024
  { id: 't3', sender: 'Charlie', receiver: 'Alice', amount: 75, currency: 'USD', cause: 'transfer', created_at: 1699693920000 }, // Nov 11 2023
  { id: 't4', sender: 'Abebe', receiver: 'Kebede', amount: 100, currency: 'ETB', cause: 'payment', created_at: 1716226200000 }, // May 20 2024
  { id: 't5', sender: 'Liya', receiver: 'Abebe', amount: 200, currency: 'USD', cause: 'transfer', created_at: 1695633600000 }, // Sep 25 2023
  { id: 't6', sender: 'Alice', receiver: 'Alice', amount: 150, currency: 'USD', cause: 'top-up', created_at: 1719858000000 }, // Jul 1 2024
  { id: 't7', sender: 'Dawit', receiver: 'Charlie', amount: 300, currency: 'ETB', cause: 'deposit', created_at: 1702200300000 }, // Dec 10 2023
  { id: 't8', sender: 'Kebede', receiver: 'Alice', amount: 90, currency: 'USD', cause: 'payment', created_at: 1708285800000 }, // Feb 18 2024
  { id: 't9', sender: 'Alice', receiver: 'Bob', amount: 120, currency: 'USD', cause: 'transfer', created_at: 1718343900000 }, // Jun 14 2024
  { id: 't10', sender: 'Charlie', receiver: 'Charlie', amount: 250, currency: 'ETB', cause: 'top-up', created_at: 1693390200000 }, // Aug 30 2023
  { id: 't11', sender: 'Bob', receiver: 'Dawit', amount: 80, currency: 'USD', cause: 'withdrawal', created_at: 1712501100000 }, // Apr 7 2024
  { id: 't12', sender: 'Abebe', receiver: 'Liya', amount: 60, currency: 'USD', cause: 'payment', created_at: 1697700900000 }, // Oct 19 2023
  { id: 't13', sender: 'Liya', receiver: 'Alice', amount: 110, currency: 'EUR', cause: 'deposit', created_at: 1715451300000 }, // May 11 2024
  { id: 't14', sender: 'Charlie', receiver: 'Kebede', amount: 70, currency: 'USD', cause: 'withdrawal', created_at: 1706550600000 }, // Jan 29 2024
  { id: 't15', sender: 'Alice', receiver: 'Dawit', amount: 95, currency: 'USD', cause: 'transfer', created_at: 1690014900000 }, // Jul 22 2023
  { id: 't16', sender: 'Dawit', receiver: 'Liya', amount: 130, currency: 'ETB', cause: 'payment', created_at: 1717439400000 }, // Jun 3 2024
  { id: 't17', sender: 'Abebe', receiver: 'Abebe', amount: 220, currency: 'USD', cause: 'top-up', created_at: 1694078400000 }, // Sep 7 2023
  { id: 't18', sender: 'Bob', receiver: 'Charlie', amount: 75, currency: 'EUR', cause: 'deposit', created_at: 1708856100000 }, // Feb 25 2024
  { id: 't19', sender: 'Kebede', receiver: 'Abebe', amount: 140, currency: 'USD', cause: 'transfer', created_at: 1701337200000 }, // Nov 30 2023
  { id: 't20', sender: 'Liya', receiver: 'Dawit', amount: 160, currency: 'USD', cause: 'withdrawal', created_at: 1721381100000 }  // Jul 19 2024
];


    const filtered = allTransactions.filter(
      (t) =>
        t.sender.toLowerCase().includes(query) ||
        t.receiver.toLowerCase().includes(query) ||
        t.cause.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query),
    );
    return { results: filtered };
  }

  return { message: `Mock POST response for ${path}` };
}}
