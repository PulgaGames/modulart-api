import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../catalog/domain/category.entity';
import { Product } from '../catalog/domain/product.entity';

const CATEGORIES = [
  {
    slug: 'closets',
    title: 'Closets',
    description: 'Closets y walk-in a medida en Ciudad de Panamá.',
  },
  {
    slug: 'puertas',
    title: 'Puertas',
    description: 'Puertas interiores y principales fabricadas a medida.',
  },
  {
    slug: 'cocinas-integrales',
    title: 'Cocinas integrales',
    description: 'Cocinas diseñadas, fabricadas e instaladas.',
  },
  {
    slug: 'comedores',
    title: 'Comedores',
    description: 'Mesas, buffets y vitrinas a medida.',
  },
  {
    slug: 'salas',
    title: 'Salas',
    description: 'Muebles TV, libreros y centros de entretenimiento.',
  },
  {
    slug: 'alcobas',
    title: 'Alcobas',
    description: 'Cabeceras, mesitas y módulos de alcoba.',
  },
  {
    slug: 'banos',
    title: 'Baños',
    description: 'Vanities y almacenamiento para ambientes húmedos.',
  },
  {
    slug: 'pisos-escalas-pasamanos',
    title: 'Pisos, escalas y pasamanos',
    description: 'Pisos, escaleras y pasamanos en madera.',
  },
];

const PRODUCTS: Array<{
  slug: string;
  title: string;
  description: string;
  material: string;
  imageUrl: string;
  location: string;
  basePrice: number;
}> = [
  {
    slug: 'closets',
    title: 'Armario moderno con espejos y cajones',
    description: 'Proyecto realizado por ModulArt en Punta Pacífica.',
    material: 'Madera natural · Melamina premium',
    imageUrl: '/public/images/closets/armario-moderno-espejos-cajones.jpg',
    location: 'Punta Pacífica',
    basePrice: 2450,
  },
  {
    slug: 'closets',
    title: 'Walk-in closet con iluminación LED',
    description: 'Walk-in closet con iluminación LED integrada en Bella Vista.',
    material: 'Teca tratada · Herrajes premium',
    imageUrl: '/public/images/closets/walk-in-closet-led-melamina.jpg',
    location: 'Bella Vista',
    basePrice: 4200,
  },
  {
    slug: 'puertas',
    title: 'Puerta corrediza de vidrio',
    description: 'Puerta corrediza de vidrio con panel iluminado.',
    material: 'Madera natural · Melamina premium',
    imageUrl: '/public/images/puertas/puerta-corrediza-vidrio-comedor.jpg',
    location: 'Punta Pacífica',
    basePrice: 980,
  },
  {
    slug: 'cocinas-integrales',
    title: 'Cocina integral moderna madera y blanco',
    description: 'Cocina integral con gabinetes en madera y blanco.',
    material: 'Madera natural · Melamina premium',
    imageUrl: '/public/images/cocinas-integrales/cocina-moderna-krion-blanco-madera.jpg',
    location: 'Punta Pacífica',
    basePrice: 6800,
  },
  {
    slug: 'cocinas-integrales',
    title: 'Cocina en nogal con isla central',
    description: 'Cocina integral en nogal con isla central.',
    material: 'Roble · Barniz satinado',
    imageUrl: '/public/images/cocinas-integrales/cocina-moderna-nogal-isla.jpg',
    location: 'San Francisco',
    basePrice: 7500,
  },
  {
    slug: 'comedores',
    title: 'Comedor con buffet mimbre y LED',
    description: 'Comedor con buffet en madera, mimbre e iluminación LED.',
    material: 'Madera natural · Melamina premium',
    imageUrl: '/public/images/comedores/comedor-buffet-mimbre-led.jpg',
    location: 'Punta Pacífica',
    basePrice: 3100,
  },
  {
    slug: 'salas',
    title: 'Mueble TV con listones y escritorio',
    description: 'Mueble de TV con listones y escritorio integrado.',
    material: 'Cedro · Acabado mate',
    imageUrl: '/public/images/salas/mueble-tv-listones-escritorio-integrado.jpg',
    location: 'Costa del Este',
    basePrice: 1950,
  },
  {
    slug: 'salas',
    title: 'Bar moderno con vista de la ciudad',
    description: 'Bar moderno con vista panorámica de la ciudad.',
    material: 'Madera natural · Melamina premium',
    imageUrl: '/public/images/salas/bar-moderno-vista-ciudad.jpg',
    location: 'Punta Pacífica',
    basePrice: 3600,
  },
  {
    slug: 'alcobas',
    title: 'Alcoba con cabecero de palma',
    description: 'Alcoba con cabecero de palma y espejos.',
    material: 'Madera natural · Melamina premium',
    imageUrl: '/public/images/alcobas/alcoba-cabecero-palma-cama-queen.jpg',
    location: 'Punta Pacífica',
    basePrice: 2100,
  },
  {
    slug: 'alcobas',
    title: 'Habitación infantil con muro de escalar',
    description: 'Habitación infantil con muro de escalar y estanterías.',
    material: 'Cedro · Acabado mate',
    imageUrl: '/public/images/alcobas/habitacion-infantil-muro-escalar.jpg',
    location: 'Costa del Este',
    basePrice: 1750,
  },
  {
    slug: 'banos',
    title: 'Vanity de madera clara con listones',
    description: 'Vanity de madera clara con panel de listones.',
    material: 'MDF lacado · Melamina texturada',
    imageUrl: '/public/images/banos/vanity-madera-clara-listones.jpg',
    location: 'Clayton',
    basePrice: 890,
  },
  {
    slug: 'banos',
    title: 'Baño moderno con vanity en madera',
    description: 'Baño moderno con repisas y vanity en madera.',
    material: 'Madera natural · Melamina premium',
    imageUrl: '/public/images/banos/bano-moderno-repisas-vanity.jpg',
    location: 'Punta Pacífica',
    basePrice: 1200,
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly log = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async onModuleInit() {
    if ((await this.categories.count()) > 0) {
      this.log.log('Seed omitido: ya hay categorías');
      return;
    }

    const saved = await this.categories.save(
      CATEGORIES.map((c) => this.categories.create(c)),
    );
    const bySlug = Object.fromEntries(saved.map((c) => [c.slug, c]));

    await this.products.save(
      PRODUCTS.map((p) =>
        this.products.create({
          title: p.title,
          description: p.description,
          material: p.material,
          imageUrl: p.imageUrl,
          location: p.location,
          basePrice: p.basePrice.toFixed(2),
          categoryId: bySlug[p.slug].id,
        }),
      ),
    );

    this.log.log(`Seed OK: ${saved.length} categorías, ${PRODUCTS.length} productos`);
  }
}
