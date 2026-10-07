import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reader } from '../entities/reader.entity';

export interface CreateReaderInput {
  fullName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
}

export type UpdateReaderInput = Partial<CreateReaderInput>;

@Injectable()
export class ReadersService {
  constructor(
    @InjectRepository(Reader)
    private readonly readers: Repository<Reader>,
  ) {}

  findAll(): Promise<Reader[]> {
    return this.readers.find();
  }

  async findOne(id: number): Promise<Reader> {
    const reader = await this.readers.findOneBy({ id });
    if (!reader) {
      throw new NotFoundException(`Reader ${id} not found`);
    }
    return reader;
  }

  create(input: CreateReaderInput): Promise<Reader> {
    return this.readers.save(this.readers.create(input));
  }

  async update(id: number, input: UpdateReaderInput): Promise<Reader> {
    const reader = await this.findOne(id);
    return this.readers.save(Object.assign(reader, input));
  }

  async remove(id: number): Promise<void> {
    const reader = await this.findOne(id);
    await this.readers.remove(reader);
  }
}