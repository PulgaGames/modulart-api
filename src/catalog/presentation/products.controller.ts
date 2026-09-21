import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from '../application/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductQueryDto } from '../dto/product-query.dto';
import { JwtGuard } from '../../auth/jwt.guard';

/**
 * Capa de presentación. En .NET: [ApiController] [Route("api/v1/products")].
 * URI versioning → /api/v1/products
 */
@ApiTags('products')
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list(@Query() query: ProductQueryDto) {
    return this.products.list(query);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.products.getById(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.products.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.products.remove(id);
  }
}
