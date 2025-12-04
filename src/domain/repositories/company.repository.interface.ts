import { Company } from '../entities/company.entity';
import { Transfer } from '../entities/transfer.entity';

export interface CompanyWithTransfers {
    company: Company;
    transfers: Transfer[];
}

export interface CompanyRepository {
    save(company: Company): Promise<void>;
    findById(id: string): Promise<Company | null>;
    findByName(name: string): Promise<Company | null>;
    findJoinedInDateRange(start: Date, end: Date): Promise<Company[]>;
    findWithTransfersInDateRange(start: Date, end: Date): Promise<CompanyWithTransfers[]>;
}

export const CompanyRepository = Symbol('CompanyRepository');
