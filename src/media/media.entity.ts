import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  originalName!: string;

  @Column()
  mimeType!: string;

  /** Base64 — portable entre SQLite y Postgres (bytea/blob). */
  @Column({ type: 'text' })
  data!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
