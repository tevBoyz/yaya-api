import * as crypto from 'crypto';
import { SearchTransactionDto } from 'src/transactions/dto/search-transaction-dto';


// Genereate HMAC SHA256 signature for YaYa API
export function generateSignature(apiSecret: string, method: string, path: string, queryDto: SearchTransactionDto | null): {signature: string, timestamp: string} {
  const timestamp = Date.now().toString();
  const fullPath = path.startsWith('/') ? path : `/${path}`;

  const prehash = `${timestamp}${method.toUpperCase()}${fullPath}${queryDto ? JSON.stringify(queryDto) : ''}`;
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(prehash)
    .digest('base64');

  return {signature, timestamp};
}