//interface for Transaction object
export interface Transaction {
  id: string; 
  sender: string;
  receiver: string;
  amount: number;
  currency: string;
  cause: string;
  createdAt: string;
}
