import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import {
  BorrowedRecord,
  BorrowedRecordStatus,
} from '../entities/borrowed-record.entity';
import { Reader } from '../entities/reader.entity';

export interface CreateBorrowedRecordInput {
  bookId: number;
  readerId: number;
  dueAt: string;
  borrowedAt?: string;
}

@Injectable()
export class BorrowedRecordsService {
  constructor(
    @InjectRepository(BorrowedRecord)
    private readonly records: Repository<BorrowedRecord>,
    @InjectRepository(Book)
    private readonly books: Repository<Book>,
    @InjectRepository(Reader)
    private readonly readers: Repository<Reader>,
  ) {}

  findAll(): Promise<BorrowedRecord[]> {
    return this.records.find({ relations: { book: true, reader: true } });
  }

  async findOne(id: number): Promise<BorrowedRecord> {
    const record = await this.records.findOne({
      where: { id },
      relations: { book: true, reader: true },
    });
    if (!record) {
      throw new NotFoundException(`Borrowed record ${id} not found`);
    }
    return record;
  }

  async create(input: CreateBorrowedRecordInput): Promise<BorrowedRecord> {
    const [book, reader] = await Promise.all([
      this.books.findOneBy({ id: input.bookId }),
      this.readers.findOneBy({ id: input.readerId }),
    ]);

    if (!book) {
      throw new NotFoundException(`Book ${input.bookId} not found`);
    }
    if (!reader) {
      throw new NotFoundException(`Reader ${input.readerId} not found`);
    }

    const record = this.records.create({
      book,
      reader,
      borrowedAt: input.borrowedAt ? new Date(input.borrowedAt) : new Date(),
      dueAt: new Date(input.dueAt),
      returnedAt: null,
      status: BorrowedRecordStatus.BORROWED,
    });
    return this.records.save(record);
  }

  async returnBook(id: number): Promise<BorrowedRecord> {
    const record = await this.findOne(id);
    if (record.status === BorrowedRecordStatus.RETURNED) {
      throw new ConflictException(`Borrowed record ${id} is already returned`);
    }

    record.status = BorrowedRecordStatus.RETURNED;
    record.returnedAt = new Date();
    return this.records.save(record);
  }
}