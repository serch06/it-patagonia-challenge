import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { TransferOrmEntity } from './transfer.orm-entity';

@Entity('companies')
export class CompanyOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    joinedAt: Date;

    @OneToMany(() => TransferOrmEntity, (transfer) => transfer.company)
    transfers: TransferOrmEntity[];
}
