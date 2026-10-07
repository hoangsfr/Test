import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BorrowedRecord } from './borrowed-record.entity';

@Entity('readers')
export class Reader {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  fullName: string;

  @Column({ unique: true, length: 254 })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string | null;

  @Column({ length: 300, nullable: true })
  address: string | null;

  @OneToMany(() => BorrowedRecord, (record) => record.reader)
  borrowedRecords: BorrowedRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}