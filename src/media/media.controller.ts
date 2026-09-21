import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { MediaService } from './media.service';
import { JwtGuard } from '../auth/jwt.guard';

@ApiTags('media')
@Controller({ path: 'media', version: '1' })
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('Adjunta un archivo en el campo file');
    }
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol;
    const publicBase = `${proto}://${req.get('host')}`;
    return this.media.create(file, publicBase.replace(/\/$/, ''));
  }

  @Get(':id')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    const item = await this.media.getById(id);
    return new StreamableFile(Buffer.from(item.data, 'base64'), {
      type: item.mimeType,
      disposition: `inline; filename="${item.originalName}"`,
    });
  }
}
