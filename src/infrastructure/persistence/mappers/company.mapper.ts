import { Company, CompanyType } from '../../../domain/entities/company.entity';
import { CompanyOrmEntity } from '../entities/company.orm-entity';

export class CompanyMapper {
    static toDomain(ormEntity: CompanyOrmEntity): Company {
        return new Company(
            ormEntity.id,
            ormEntity.name,
            ormEntity.type as CompanyType,
            ormEntity.joinedAt,
        );
    }

    static toOrm(domainEntity: Company): CompanyOrmEntity {
        const ormEntity = new CompanyOrmEntity();
        ormEntity.id = domainEntity.id;
        ormEntity.name = domainEntity.name;
        ormEntity.type = domainEntity.type;
        ormEntity.joinedAt = domainEntity.joinedAt;
        return ormEntity;
    }
}
