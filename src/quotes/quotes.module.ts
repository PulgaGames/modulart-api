import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from './domain/quote.entity';
import { QuoteItem } from './domain/quote-item.entity';
import { QuotesService } from './application/quotes.service';
import { QuotesController } from './presentation/quotes.controller';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, QuoteItem]), CatalogModule],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
