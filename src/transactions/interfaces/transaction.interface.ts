export interface Transaction {
  id: string; // Transaction ID
  sender: string;
  receiver: string;
  amount: number;
  currency: string;
  cause: string;
  createdAt: string; // ISO timestamp
}
