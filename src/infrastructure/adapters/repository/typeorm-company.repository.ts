import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CompanyRepository, CompanyWithTransfers } from '../../../domain/repositories/company.repository.interface';
import { Company } from '../../../domain/entities/company.entity';
import { Transfer } from '../../../domain/entities/transfer.entity';
import { CompanyOrmEntity } from '../../persistence/entities/company.orm-entity';
import { CompanyMapper } from '../../persistence/mappers/company.mapper';

@Injectable()
export class TypeOrmCompanyRepository implements CompanyRepository {
    constructor(
        @InjectRepository(CompanyOrmEntity)
        private readonly repository: Repository<CompanyOrmEntity>,
    ) { }

    async save(company: Company): Promise<void> {
        const ormEntity = CompanyMapper.toOrm(company);
        await this.repository.save(ormEntity);
    }

    async findById(id: string): Promise<Company | null> {
        const ormEntity = await this.repository
            .createQueryBuilder('company')
            .where('company.id = :id', { id })
            .getOne();
        return ormEntity ? CompanyMapper.toDomain(ormEntity) : null;
    }

    async findJoinedInDateRange(start: Date, end: Date): Promise<Company[]> {
        const ormEntities = await this.repository.find({
            where: {
                joinedAt: Between(start, end),
            },
        });
        return ormEntities.map(CompanyMapper.toDomain);
    }

    async findWithTransfersInDateRange(start: Date, end: Date): Promise<CompanyWithTransfers[]> {
        const ormEntities = await this.repository
            .createQueryBuilder('company')
            .innerJoinAndSelect('company.transfers', 'transfer', 'transfer.date BETWEEN :start AND :end', { start, end })
            .getMany();

        return ormEntities.map((entity) => ({
            company: CompanyMapper.toDomain(entity),
            transfers: entity.transfers.map(
                (t) => new Transfer(t.id, t.companyId, Number(t.amount), t.date),
            ),
        }));
    }
}
