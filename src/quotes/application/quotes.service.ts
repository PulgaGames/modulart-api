import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Quote } from '../domain/quote.entity';
import { QuoteItem } from '../domain/quote-item.entity';
import { ALLOWED_TRANSITIONS, QuoteStatus } from '../domain/quote-status.enum';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { PaginationQueryDto, paginate } from '../../common/dto/pagination-query.dto';
import { Product } from '../../catalog/domain/product.entity';

const ITBMS = 0.07;

function money(value: number): string {
  return value.toFixed(2);
}

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private readonly quotes: Repository<Quote>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async list(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const [items, total] = await this.quotes.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(items, total, page, limit);
  }

  async getById(id: string) {
    const quote = await this.quotes.findOne({ where: { id } });
    if (!quote) {
      throw new NotFoundException(`Cotización ${id} no existe`);
    }
    return quote;
  }

  async create(dto: CreateQuoteDto) {
    for (const item of dto.items) {
      if (item.productId) {
        const exists = await this.products.exists({ where: { id: item.productId } });
        if (!exists) {
          throw new NotFoundException(`Producto ${item.productId} no existe`);
        }
      }
    }

    let subtotal = 0;
    const lines = dto.items.map((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      subtotal += lineTotal;
      return {
        productId: item.productId ?? null,
        description: item.description,
        quantity: item.quantity,
        unitPrice: money(item.unitPrice),
        lineTotal: money(lineTotal),
      };
    });

    const taxAmount = subtotal * ITBMS;
    const total = subtotal + taxAmount;

    return this.dataSource.transaction(async (manager) => {
      const quote = manager.create(Quote, {
        projectName: dto.projectName,
        clientName: dto.clientName,
        clientEmail: dto.clientEmail,
        clientPhone: dto.clientPhone ?? null,
        notes: dto.notes ?? null,
        status: QuoteStatus.Pending,
        taxRate: money(ITBMS),
        subtotal: money(subtotal),
        taxAmount: money(taxAmount),
        total: money(total),
      });
      const saved = await manager.save(quote);

      const items = lines.map((line) =>
        manager.create(QuoteItem, { ...line, quoteId: saved.id }),
      );
      saved.items = await manager.save(items);
      return saved;
    });
  }

  async updateStatus(id: string, next: QuoteStatus) {
    const quote = await this.getById(id);
    const allowed = ALLOWED_TRANSITIONS[quote.status];
    if (!allowed.includes(next)) {
      throw new UnprocessableEntityException(
        `No se puede pasar de ${quote.status} a ${next}`,
      );
    }
    quote.status = next;
    return this.quotes.save(quote);
  }

  async remove(id: string) {
    const quote = await this.getById(id);
    await this.quotes.remove(quote);
  }
}
