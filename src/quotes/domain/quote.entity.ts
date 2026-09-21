import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuoteItem } from './quote-item.entity';
import { QuoteStatus } from './quote-status.enum';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  projectName!: string;

  @Column()
  clientName!: string;

  @Column()
  clientEmail!: string;

  @Column({ type: 'varchar', nullable: true })
  clientPhone!: string | null;

  @Column({ type: 'varchar', default: QuoteStatus.Pending })
  status!: QuoteStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal!: string;

  /** ITBMS Panamá: 7% — se calcula en el servidor, nunca se confía en el cliente. */
  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0.07 })
  taxRate!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  taxAmount!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @OneToMany(() => QuoteItem, (item) => item.quote, {
    cascade: true,
    eager: true,
  })
  items!: QuoteItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
