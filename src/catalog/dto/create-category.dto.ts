import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'closets' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug: minúsculas, números y guiones (ej. closets)',
  })
  slug!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;
}
