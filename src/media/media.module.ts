import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), AuthModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
