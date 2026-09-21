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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from '../application/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { JwtGuard } from '../../auth/jwt.guard';

@ApiTags('categories')
@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  list() {
    return this.categories.list();
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.categories.getById(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCategoryDto) {
    return this.categories.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categories.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categories.remove(id);
  }
}
