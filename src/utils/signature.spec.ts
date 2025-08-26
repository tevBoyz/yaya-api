import { generateSignature } from './signature';
import 'dotenv/config';


describe('generateSignature', () => {
    const apiSecret = process.env.YAYA_API_SECRET;
    if (typeof apiSecret !== 'string') {
      throw new Error('YAYA_API_SECRET must be defined as a string');
    }

  it('should generate a 64-character hex signature for GET request', () => {
    const {signature: sig} = generateSignature(
      apiSecret, 'GET', '/api/en/transaction/find-by-user?p=1',null
    );

    expect(sig).toMatch(/^[A-Za-z0-9+/=]{43,44}$/);
  });

  it('should generate consistent signatures for same input', () => {
    const {signature: sig1} = generateSignature(
      apiSecret, 'POST', '/api/en/transaction/search', { query: 'abebe' }
    );

    const {signature: sig2} = generateSignature(
      apiSecret, 'POST', '/api/en/transaction/search', { query: 'abebe' }
    );

    expect(sig1).toEqual(sig2);
  });

  it('should produce different signatures for different body payloads', () => {
    const {signature: sig1} = generateSignature(
      apiSecret, 'POST', '/api/en/transaction/search', { query: 'abebe' }
    );

    const {signature: sig2} = generateSignature(
      apiSecret, 'POST', '/api/en/transaction/search', { query: 'kebede' }
    );

    expect(sig1).not.toEqual(sig2);
  });
});
