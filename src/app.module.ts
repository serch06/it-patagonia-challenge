import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './infrastructure/company.module';
import { CompanyOrmEntity } from './infrastructure/persistence/entities/company.orm-entity';
import { TransferOrmEntity } from './infrastructure/persistence/entities/transfer.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [CompanyOrmEntity, TransferOrmEntity],
      synchronize: true,
    }),
    CompanyModule,
  ],
})
export class AppModule { }
