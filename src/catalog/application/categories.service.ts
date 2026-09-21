import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../domain/category.entity';
import { Product } from '../domain/product.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  list() {
    return this.categories.find({ order: { title: 'ASC' } });
  }

  async getById(id: string) {
    const category = await this.categories.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Categoría ${id} no existe`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const exists = await this.categories.exists({ where: { slug: dto.slug } });
    if (exists) {
      throw new ConflictException(`Ya existe la categoría ${dto.slug}`);
    }
    return this.categories.save(this.categories.create(dto));
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.getById(id);
    if (dto.slug && dto.slug !== category.slug) {
      const taken = await this.categories.exists({ where: { slug: dto.slug } });
      if (taken) {
        throw new ConflictException(`Ya existe la categoría ${dto.slug}`);
      }
      category.slug = dto.slug;
    }
    if (dto.title !== undefined) category.title = dto.title;
    if (dto.description !== undefined) category.description = dto.description;
    return this.categories.save(category);
  }

  async remove(id: string) {
    const category = await this.getById(id);
    const count = await this.products.count({ where: { categoryId: id } });
    if (count > 0) {
      throw new ConflictException(
        `No se puede eliminar: hay ${count} producto(s) en esta categoría`,
      );
    }
    await this.categories.remove(category);
  }
}
