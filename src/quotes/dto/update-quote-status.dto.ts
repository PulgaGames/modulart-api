import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QuoteStatus } from '../domain/quote-status.enum';

export class UpdateQuoteStatusDto {
  @ApiProperty({ enum: QuoteStatus })
  @IsEnum(QuoteStatus)
  status!: QuoteStatus;
}
