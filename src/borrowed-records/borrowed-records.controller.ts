import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BorrowedRecordsService } from './borrowed-records.service';
import type { CreateBorrowedRecordInput } from './borrowed-records.service';

@Controller('borrowed-records')
export class BorrowedRecordsController {
  constructor(private readonly recordsService: BorrowedRecordsService) {}

  @Get()
  findAll() {
    return this.recordsService.findAll();
  }

  @Get('borrowed-books')
  findBorrowedBooks() {
    return this.recordsService.findBorrowedBooks();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recordsService.findOne(id);
  }

  @Post()
  create(@Body() input: CreateBorrowedRecordInput) {
    return this.recordsService.create(input);
  }

  @Patch(':id/return')
  returnBook(@Param('id', ParseIntPipe) id: number) {
    return this.recordsService.returnBook(id);
  }
}