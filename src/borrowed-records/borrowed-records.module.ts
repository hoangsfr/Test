import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { BorrowedRecord } from '../entities/borrowed-record.entity';
import { Reader } from '../entities/reader.entity';
import { BorrowedRecordsController } from './borrowed-records.controller';
import { BorrowedRecordsService } from './borrowed-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([BorrowedRecord, Book, Reader])],
  controllers: [BorrowedRecordsController],
  providers: [BorrowedRecordsService],
  exports: [BorrowedRecordsService],
})
export class BorrowedRecordsModule {}