import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BorrowedRecord } from './borrowed-record.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 150 })
  author: string;

  @Column({ unique: true, length: 20 })
  isbn: string;

  @Column({ length: 150, nullable: true })
  publisher: string | null;

  @Column({ type: 'int', nullable: true })
  publicationYear: number | null;

  @Column({ type: 'int', default: 1 })
  totalCopies: number;

  @OneToMany(() => BorrowedRecord, (record) => record.book)
  borrowedRecords: BorrowedRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}