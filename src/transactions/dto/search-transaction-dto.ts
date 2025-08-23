import { IsString } from 'class-validator';

export class SearchTransactionDto {
  @IsString()
  query: string;
}
