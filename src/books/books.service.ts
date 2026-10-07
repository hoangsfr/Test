import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';

export interface CreateBookInput {
  title: string;
  author: string;
  isbn: string;
  publisher?: string | null;
  publicationYear?: number | null;
  totalCopies?: number;
}

export type UpdateBookInput = Partial<CreateBookInput>;

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly books: Repository<Book>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.books.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.books.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book ${id} not found`);
    }
    return book;
  }

  create(input: CreateBookInput): Promise<Book> {
    return this.books.save(this.books.create(input));
  }

  async update(id: number, input: UpdateBookInput): Promise<Book> {
    const book = await this.findOne(id);
    return this.books.save(Object.assign(book, input));
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.books.remove(book);
  }
}