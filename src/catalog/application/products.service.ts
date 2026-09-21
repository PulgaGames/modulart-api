import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../domain/category.entity';
import { ProductRepository } from '../infrastructure/product.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductQueryDto } from '../dto/product-query.dto';
import { paginate } from '../../common/dto/pagination-query.dto';

/**
 * Capa de aplicación (casos de uso).
 * En .NET: ProductService / IProductAppService.
 * No conoce HTTP. El controller es el único que habla REST.
 */
@Injectable()
export class ProductsService {
  constructor(
    private readonly products: ProductRepository,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async list(query: ProductQueryDto) {
    const [items, total] = await this.products.findPaged(query);
    return paginate(items, total, query.page ?? 1, query.limit ?? 10);
  }

  async getById(id: string) {
    const product = await this.products.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto ${id} no existe`);
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    const category = await this.categories.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Categoría ${dto.categoryId} no existe`);
    }

    return this.products.create({
      ...dto,
      basePrice: dto.basePrice.toFixed(2),
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.getById(id);

    if (dto.categoryId && dto.categoryId !== product.categoryId) {
      const category = await this.categories.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Categoría ${dto.categoryId} no existe`);
      }
      product.categoryId = dto.categoryId;
    }

    if (dto.title !== undefined) product.title = dto.title;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.material !== undefined) product.material = dto.material;
    if (dto.imageUrl !== undefined) product.imageUrl = dto.imageUrl;
    if (dto.location !== undefined) product.location = dto.location;
    if (dto.basePrice !== undefined) product.basePrice = dto.basePrice.toFixed(2);

    return this.products.save(product);
  }

  async remove(id: string) {
    const product = await this.getById(id);
    try {
      await this.products.remove(product);
    } catch {
      throw new ConflictException(
        'No se puede eliminar: el producto está referenciado en cotizaciones',
      );
    }
  }
}
