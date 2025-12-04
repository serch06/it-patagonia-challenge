import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './controllers/company.controller';
import { RegisterCompanyUseCase } from '../application/use-cases/register-company.use-case';
import { GetCompaniesJoinedLastMonthUseCase } from '../application/use-cases/get-companies-joined-last-month.use-case';
import { GetCompaniesWithTransfersLastMonthUseCase } from '../application/use-cases/get-companies-with-transfers-last-month.use-case';
import { RegisterTransferUseCase } from '../application/use-cases/register-transfer.use-case';
import { TypeOrmCompanyRepository } from './adapters/repository/typeorm-company.repository';
import { TypeOrmTransferRepository } from './adapters/repository/typeorm-transfer.repository';
import { CompanyRepository } from '../domain/repositories/company.repository.interface';
import { TransferRepository } from '../domain/repositories/transfer.repository.interface';
import { CompanyOrmEntity } from './persistence/entities/company.orm-entity';
import { TransferOrmEntity } from './persistence/entities/transfer.orm-entity';

@Module({
    imports: [TypeOrmModule.forFeature([CompanyOrmEntity, TransferOrmEntity])],
    controllers: [CompanyController],
    providers: [
        RegisterCompanyUseCase,
        GetCompaniesJoinedLastMonthUseCase,
        GetCompaniesWithTransfersLastMonthUseCase,
        RegisterTransferUseCase,
        {
            provide: CompanyRepository,
            useClass: TypeOrmCompanyRepository,
        },
        {
            provide: TransferRepository,
            useClass: TypeOrmTransferRepository,
        },
    ],
})
export class CompanyModule { }
