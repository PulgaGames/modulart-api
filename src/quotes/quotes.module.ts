import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from './domain/quote.entity';
import { QuoteItem } from './domain/quote-item.entity';
import { QuotesService } from './application/quotes.service';
import { QuotesController } from './presentation/quotes.controller';
import { CatalogModule } from '../catalog/catalog.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, QuoteItem]), CatalogModule, AuthModule],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
