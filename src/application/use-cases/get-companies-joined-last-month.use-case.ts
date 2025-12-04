import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import { CompanyRepository } from '../../domain/repositories/company.repository.interface';

@Injectable()
export class GetCompaniesJoinedLastMonthUseCase {
    constructor(
        @Inject(CompanyRepository)
        private readonly companyRepository: CompanyRepository,
    ) { }

    async execute(): Promise<Company[]> {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        try {
            return await this.companyRepository.findJoinedInDateRange(start, end);
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch companies joined last month', { cause: error as Error });
        }
    }
}
