import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import {
  BorrowedRecord,
  BorrowedRecordStatus,
} from '../entities/borrowed-record.entity';
import { Reader } from '../entities/reader.entity';
import { BorrowedRecordsService } from './borrowed-records.service';

describe('BorrowedRecordsService', () => {
  let service: BorrowedRecordsService;
  let records: {
    create: jest.Mock;
    find: jest.Mock;
    save: jest.Mock;
  };
  let books: { findOneBy: jest.Mock };
  let readers: { findOneBy: jest.Mock };

  beforeEach(() => {
    records = {
      create: jest.fn((input) => input),
      find: jest.fn(),
      save: jest.fn(async (input) => ({ id: 12, ...input })),
    };
    books = { findOneBy: jest.fn() };
    readers = { findOneBy: jest.fn() };
    service = new BorrowedRecordsService(
      records as unknown as Repository<BorrowedRecord>,
      books as unknown as Repository<Book>,
      readers as unknown as Repository<Reader>,
    );
  });

  it('creates and saves a borrowed record for the selected book and reader', async () => {
    const book = { id: 3, title: 'NestJS Basics' } as Book;
    const reader = { id: 7, fullName: 'Nguyen An' } as Reader;
    books.findOneBy.mockResolvedValue(book);
    readers.findOneBy.mockResolvedValue(reader);

    const result = await service.create({
      bookId: 3,
      readerId: 7,
      dueAt: '2026-10-20T00:00:00.000Z',
    });

    expect(records.save).toHaveBeenCalledWith(
      expect.objectContaining({
        book,
        reader,
        status: BorrowedRecordStatus.BORROWED,
        dueAt: new Date('2026-10-20T00:00:00.000Z'),
      }),
    );
    expect(result.id).toBe(12);
  });

  it('lists borrowed books with borrower and loan dates', async () => {
    const borrowedAt = new Date('2026-10-01T00:00:00.000Z');
    const dueAt = new Date('2026-10-20T00:00:00.000Z');
    records.find.mockResolvedValue([
      {
        book: { id: 3, title: 'NestJS Basics', author: 'A. Nguyen', isbn: '123' },
        reader: { id: 7, fullName: 'Nguyen An' },
        borrowedAt,
        dueAt,
      },
    ]);

    const result = await service.findBorrowedBooks();

    expect(records.find).toHaveBeenCalledWith({
      where: { status: BorrowedRecordStatus.BORROWED },
      relations: { book: true, reader: true },
      order: { borrowedAt: 'DESC' },
    });
    expect(result).toEqual([
      {
        id: 3,
        title: 'NestJS Basics',
        author: 'A. Nguyen',
        isbn: '123',
        borrowedAt,
        borrower: { id: 7, fullName: 'Nguyen An' },
        dueAt,
      },
    ]);
  });
});