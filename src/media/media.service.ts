import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './media.entity';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly media: Repository<Media>,
  ) {}

  async create(file: Express.Multer.File, publicBase: string) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }
    if (!ALLOWED.has(file.mimetype)) {
      throw new BadRequestException(
        'Formato no permitido. Usa JPG, PNG, WEBP o GIF',
      );
    }
    const saved = await this.media.save(
      this.media.create({
        originalName: file.originalname,
        mimeType: file.mimetype,
        data: file.buffer.toString('base64'),
      }),
    );
    return {
      id: saved.id,
      originalName: saved.originalName,
      mimeType: saved.mimeType,
      url: `${publicBase}/api/v1/media/${saved.id}`,
    };
  }

  async getById(id: string) {
    const item = await this.media.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Imagen ${id} no existe`);
    }
    return item;
  }
}
