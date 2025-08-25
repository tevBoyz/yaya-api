import { IsString } from 'class-validator';

//Data Transfer Object for search params
export class SearchTransactionDto {
  @IsString()
  query: string;
}
