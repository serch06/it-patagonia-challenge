import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RegisterTransferUseCase, RegisterTransferDto } from './register-transfer.use-case';
import { TransferRepository } from '../../domain/repositories/transfer.repository.interface';
import { CompanyRepository } from '../../domain/repositories/company.repository.interface';
import { Company, CompanyType } from '../../domain/entities/company.entity';
import { Transfer } from '../../domain/entities/transfer.entity';

describe('RegisterTransferUseCase', () => {
    let transferRepository: jest.Mocked<TransferRepository>;
    let companyRepository: jest.Mocked<CompanyRepository>;
    let useCase: RegisterTransferUseCase;

    beforeEach(() => {
        transferRepository = {
            save: jest.fn(),
        };

        companyRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findByName: jest.fn(),
            findJoinedInDateRange: jest.fn(),
            findWithTransfersInDateRange: jest.fn(),
        };

        useCase = new RegisterTransferUseCase(transferRepository, companyRepository);
    });

    it('registers a transfer when the company exists', async () => {
        const company = new Company('company-1', 'Acme Inc.', CompanyType.Pyme, new Date());
        companyRepository.findById.mockResolvedValue(company);
        transferRepository.save.mockResolvedValue();

        const dto: RegisterTransferDto = { companyId: company.id, amount: 123.45 };
        const result = await useCase.execute(dto);

        expect(companyRepository.findById).toHaveBeenCalledWith(company.id);
        expect(transferRepository.save).toHaveBeenCalledWith(expect.any(Transfer));
        expect(result.companyId).toBe(company.id);
        expect(result.amount).toBe(123.45);
        expect(result.date).toBeInstanceOf(Date);
    });

    it('throws NotFoundException when the company does not exist', async () => {
        companyRepository.findById.mockResolvedValue(null);

        await expect(
            useCase.execute({ companyId: 'missing', amount: 10 }),
        ).rejects.toBeInstanceOf(NotFoundException);
        expect(transferRepository.save).not.toHaveBeenCalled();
    });

    it('wraps unexpected errors as InternalServerErrorException', async () => {
        companyRepository.findById.mockRejectedValue(new Error('database down'));

        await expect(
            useCase.execute({ companyId: 'company-1', amount: 10 }),
        ).rejects.toBeInstanceOf(InternalServerErrorException);
    });
});
