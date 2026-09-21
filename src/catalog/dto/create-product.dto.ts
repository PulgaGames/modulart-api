import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  material!: string;

  @ApiProperty({ example: '/public/images/closets/armario-moderno-espejos-cajones.jpg' })
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 1850 })
  @IsNumber()
  @Min(0)
  basePrice!: number;

  @ApiProperty({ description: 'UUID de la categoría' })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;
}
