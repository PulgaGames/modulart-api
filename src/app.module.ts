import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { CatalogModule } from './catalog/catalog.module';
import { QuotesModule } from './quotes/quotes.module';

/**
 * AppModule ≈ Startup/Program.cs + IServiceCollection.
 * Cada forRoot/forFeature registra proveedores en el contenedor DI de Nest
 * (el mismo patrón que AddDbContext / AddScoped en .NET).
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbType = config.get<string>('DB_TYPE', 'sqlite');
        const sync = config.get<string>('DB_SYNC', 'true') !== 'false';

        if (dbType === 'sqlite') {
          return {
            type: 'sqlite' as const,
            database: 'modulart.sqlite',
            autoLoadEntities: true,
            synchronize: true,
          };
        }

        // Render / Railway entregan una sola DATABASE_URL (como Connection String en Azure).
        const databaseUrl = config.get<string>('DATABASE_URL');
        const ssl =
          config.get<string>('DB_SSL', databaseUrl ? 'true' : 'false') === 'true'
            ? { rejectUnauthorized: false }
            : false;

        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            ssl,
            extra: ssl ? { ssl } : undefined,
            autoLoadEntities: true,
            synchronize: sync,
          };
        }

        return {
          type: 'postgres' as const,
          host: config.get<string>('DB_HOST', 'localhost'),
          port: Number(config.get('DB_PORT', 5432)),
          username: config.get<string>('DB_USER', 'modulart'),
          password: config.get<string>('DB_PASSWORD', 'modulart'),
          database: config.get<string>('DB_NAME', 'modulart'),
          ssl,
          extra: ssl ? { ssl } : undefined,
          autoLoadEntities: true,
          synchronize: sync,
        };
      },
    }),
    HealthModule,
    CatalogModule,
    QuotesModule,
  ],
})
export class AppModule {}
