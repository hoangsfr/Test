import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Book } from './entities/book.entity';
import { Reader } from './entities/reader.entity';
import { BorrowedRecord } from './entities/borrowed-record.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const sslEnabled = config.get('DB_SSL') === 'true';
        const ca = config.get<string>('DB_SSL_CA')?.replace(/\\n/g, '\n');

        return {
          type: 'mysql',
          host: config.getOrThrow<string>('DB_HOST'),
          port: Number(config.get('DB_PORT') ?? 3306),
          username: config.getOrThrow<string>('DB_USERNAME'),
          password: config.getOrThrow<string>('DB_PASSWORD'),
          database: config.getOrThrow<string>('DB_DATABASE'),
          entities: [Book, Reader, BorrowedRecord],
          synchronize: config.get('DB_SYNCHRONIZE') === 'true',
          ...(sslEnabled
            ? { ssl: { rejectUnauthorized: true, ...(ca ? { ca } : {}) } }
            : {}),
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}