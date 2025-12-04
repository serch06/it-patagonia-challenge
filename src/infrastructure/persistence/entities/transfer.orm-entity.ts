import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyOrmEntity } from './company.orm-entity';

@Entity('transfers')
export class TransferOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column('decimal')
    amount: number;

    @Column()
    date: Date;

    @Column()
    companyId: string;

    @ManyToOne(() => CompanyOrmEntity, (company) => company.transfers)
    @JoinColumn({ name: 'companyId' })
    company: CompanyOrmEntity;
}
