import { Inject, Injectable } from '@nestjs/common';
import { Company, CompanyType } from '../../domain/entities/company.entity';
import { CompanyRepository } from '../../domain/repositories/company.repository.interface';
import { randomUUID } from 'crypto';
import { IsEnum, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterCompanyDto {
    @ApiProperty({ description: 'Nombre de la empresa', example: 'Mi Empresa S.A.' })
    @IsString()
    name: string;

    @ApiProperty({ enum: CompanyType, description: 'Tipo de empresa', example: 'Pyme' })
    @IsEnum(CompanyType)
    type: CompanyType;

    @ApiPropertyOptional({ description: 'Fecha de adhesión (ISO 8601)', example: '2025-11-15T10:00:00Z' })
    @IsOptional()
    @IsDateString()
    joinedAt?: Date;
}

@Injectable()
export class RegisterCompanyUseCase {
    constructor(
        @Inject(CompanyRepository)
        private readonly companyRepository: CompanyRepository,
    ) { }

    async execute(dto: RegisterCompanyDto): Promise<Company> {
        const company = new Company(
            randomUUID(),
            dto.name,
            dto.type,
            dto.joinedAt ? new Date(dto.joinedAt) : new Date(),
        );
        await this.companyRepository.save(company);
        return company;
    }
}
