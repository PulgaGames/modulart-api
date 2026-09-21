import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from '../domain/product.entity';
import { ProductQueryDto } from '../dto/product-query.dto';

/**
 * Puerto de persistencia (hexagonal / hexagonal lite).
 * El service no habla con TypeORM directo: habla con este repositorio.
 * En .NET: IProductRepository + ProductRepository : IProductRepository.
 */
@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async findPaged(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Record<string, unknown> = {};

    if (query.q) {
      return this.repo.findAndCount({
        where: [
          { title: Like(`%${query.q}%`) },
          { description: Like(`%${query.q}%`) },
        ],
        relations: ['category'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
    }

    if (query.category) {
      where.category = { slug: query.category };
    }

    return this.repo.findAndCount({
      where,
      relations: ['category'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['category'] });
  }

  create(data: Partial<Product>) {
    return this.repo.save(this.repo.create(data));
  }

  save(product: Product) {
    return this.repo.save(product);
  }

  async remove(product: Product) {
    await this.repo.remove(product);
  }

  count() {
    return this.repo.count();
  }
}
