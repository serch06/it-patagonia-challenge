import { Inject, Injectable } from '@nestjs/common';
import { CompanyRepository, CompanyWithTransfers } from '../../domain/repositories/company.repository.interface';

@Injectable()
export class GetCompaniesWithTransfersLastMonthUseCase {
    constructor(
        @Inject(CompanyRepository)
        private readonly companyRepository: CompanyRepository,
    ) { }

    async execute(): Promise<CompanyWithTransfers[]> {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return this.companyRepository.findWithTransfersInDateRange(start, end);
    }
}
