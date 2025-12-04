import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  RegisterCompanyUseCase,
  RegisterCompanyDto,
} from './register-company.use-case';
import { CompanyRepository } from '../../domain/repositories/company.repository.interface';
import { Company, CompanyType } from '../../domain/entities/company.entity';

describe('RegisterCompanyUseCase', () => {
  let companyRepository: jest.Mocked<CompanyRepository>;
  let useCase: RegisterCompanyUseCase;

  beforeEach(() => {
    companyRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findJoinedInDateRange: jest.fn(),
      findWithTransfersInDateRange: jest.fn(),
    };
    useCase = new RegisterCompanyUseCase(companyRepository);
  });

  it('creates a company when the name is unique', async () => {
    companyRepository.findByName.mockResolvedValue(null);
    companyRepository.save.mockResolvedValue();

    const dto: RegisterCompanyDto = {
      name: 'Acme Inc.',
      type: CompanyType.PYME,
    };
    const result = await useCase.execute(dto);

    expect(companyRepository.findByName).toHaveBeenCalledWith('Acme Inc.');
    expect(companyRepository.save).toHaveBeenCalledWith(expect.any(Company));
    expect(result.name).toBe('Acme Inc.');
    expect(result.joinedAt).toBeInstanceOf(Date);
  });

  it('throws conflict when the company already exists', async () => {
    companyRepository.findByName.mockResolvedValue(
      new Company('company-1', 'Acme Inc.', CompanyType.PYME, new Date()),
    );

    await expect(
      useCase.execute({ name: 'Acme Inc.', type: CompanyType.PYME }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(companyRepository.save).not.toHaveBeenCalled();
  });

  it('wraps unexpected errors as InternalServerErrorException', async () => {
    companyRepository.findByName.mockRejectedValue(new Error('database down'));

    await expect(
      useCase.execute({ name: 'Acme Inc.', type: CompanyType.PYME }),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
