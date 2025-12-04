import { Inject, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Transfer } from '../../domain/entities/transfer.entity';
import { TransferRepository } from '../../domain/repositories/transfer.repository.interface';
import { CompanyRepository } from '../../domain/repositories/company.repository.interface';
import { randomUUID } from 'crypto';
import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterTransferDto {
    @ApiProperty({ description: 'ID de la empresa que realiza la transferencia' })
    @IsString()
    companyId: string;

    @ApiProperty({ description: 'Monto de la transferencia', example: 1000.50 })
    @IsNumber()
    @Min(0.01)
    amount: number;

    @ApiPropertyOptional({ description: 'Fecha de la transferencia (ISO 8601)', example: '2025-11-20T15:00:00Z' })
    @IsOptional()
    @IsDateString()
    date?: string;
}

@Injectable()
export class RegisterTransferUseCase {
    constructor(
        @Inject(TransferRepository)
        private readonly transferRepository: TransferRepository,
        @Inject(CompanyRepository)
        private readonly companyRepository: CompanyRepository,
    ) { }

    async execute(dto: RegisterTransferDto): Promise<Transfer> {
        try {
            const company = await this.companyRepository.findById(dto.companyId);
            if (!company) {
                throw new NotFoundException(`Empresa con ID ${dto.companyId} no encontrada`);
            }

            const transfer = new Transfer(
                randomUUID(),
                dto.companyId,
                dto.amount,
                dto.date ? new Date(dto.date) : new Date(),
            );
            await this.transferRepository.save(transfer);
            return transfer;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to register transfer', { cause: error as Error });
        }
    }
}
