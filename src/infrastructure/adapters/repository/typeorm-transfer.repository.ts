import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferRepository } from '../../../domain/repositories/transfer.repository.interface';
import { Transfer } from '../../../domain/entities/transfer.entity';
import { TransferOrmEntity } from '../../persistence/entities/transfer.orm-entity';

@Injectable()
export class TypeOrmTransferRepository implements TransferRepository {
    constructor(
        @InjectRepository(TransferOrmEntity)
        private readonly repository: Repository<TransferOrmEntity>,
    ) { }

    async save(transfer: Transfer): Promise<void> {
        const ormEntity = new TransferOrmEntity();
        ormEntity.id = transfer.id;
        ormEntity.companyId = transfer.companyId;
        ormEntity.amount = transfer.amount;
        ormEntity.date = transfer.date;
        await this.repository.save(ormEntity);
    }
}
