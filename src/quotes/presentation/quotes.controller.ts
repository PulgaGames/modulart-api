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
import { QuotesService } from '../application/quotes.service';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { UpdateQuoteStatusDto } from '../dto/update-quote-status.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtGuard } from '../../auth/jwt.guard';

@ApiTags('quotes')
@Controller({ path: 'quotes', version: '1' })
export class QuotesController {
  constructor(private readonly quotes: QuotesService) {}

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  list(@Query() query: PaginationQueryDto) {
    return this.quotes.list(query);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.quotes.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateQuoteDto) {
    return this.quotes.create(dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuoteStatusDto,
  ) {
    return this.quotes.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.quotes.remove(id);
  }
}
