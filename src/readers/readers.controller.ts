import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ReadersService } from './readers.service';
import type { CreateReaderInput, UpdateReaderInput } from './readers.service';

@Controller('readers')
export class ReadersController {
  constructor(private readonly readersService: ReadersService) {}

  @Get()
  findAll() {
    return this.readersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.readersService.findOne(id);
  }

  @Post()
  create(@Body() input: CreateReaderInput) {
    return this.readersService.create(input);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateReaderInput,
  ) {
    return this.readersService.update(id, input);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.readersService.remove(id);
  }
}