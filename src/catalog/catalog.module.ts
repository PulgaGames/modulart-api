import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './domain/category.entity';
import { Product } from './domain/product.entity';
import { ProductRepository } from './infrastructure/product.repository';
import { ProductsService } from './application/products.service';
import { CategoriesService } from './application/categories.service';
import { ProductsController } from './presentation/products.controller';
import { CategoriesController } from './presentation/categories.controller';
import { SeedService } from '../database/seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [ProductsController, CategoriesController],
  providers: [ProductRepository, ProductsService, CategoriesService, SeedService],
  exports: [TypeOrmModule, ProductRepository],
})
export class CatalogModule {}
