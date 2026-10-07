import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { Reader } from './reader.entity';

export enum BorrowedRecordStatus {
  BORROWED = 'BORROWED',
  RETURNED = 'RETURNED',
}

@Entity('borrowed_records')
export class BorrowedRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  borrowedAt: Date;

  @Column({ type: 'datetime' })
  dueAt: Date;

  @Column({ type: 'datetime', nullable: true })
  returnedAt: Date | null;

  @Column({ type: 'varchar', length: 20, default: BorrowedRecordStatus.BORROWED })
  status: BorrowedRecordStatus;

  @ManyToOne(() => Book, (book) => book.borrowedRecords, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Reader, (reader) => reader.borrowedRecords, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'reader_id' })
  reader: Reader;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}