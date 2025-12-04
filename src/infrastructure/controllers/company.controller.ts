import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterCompanyUseCase, RegisterCompanyDto } from '../../application/use-cases/register-company.use-case';
import { GetCompaniesJoinedLastMonthUseCase } from '../../application/use-cases/get-companies-joined-last-month.use-case';
import { GetCompaniesWithTransfersLastMonthUseCase } from '../../application/use-cases/get-companies-with-transfers-last-month.use-case';
import { RegisterTransferUseCase, RegisterTransferDto } from '../../application/use-cases/register-transfer.use-case';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
    constructor(
        private readonly registerCompanyUseCase: RegisterCompanyUseCase,
        private readonly getCompaniesJoinedLastMonthUseCase: GetCompaniesJoinedLastMonthUseCase,
        private readonly getCompaniesWithTransfersLastMonthUseCase: GetCompaniesWithTransfersLastMonthUseCase,
        private readonly registerTransferUseCase: RegisterTransferUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Registrar una nueva empresa' })
    @ApiResponse({ status: 201, description: 'Empresa registrada exitosamente' })
    async register(@Body() dto: RegisterCompanyDto) {
        return this.registerCompanyUseCase.execute(dto);
    }

    @Get('joined-last-month')
    @ApiOperation({ summary: 'Obtener empresas adheridas en el último mes' })
    @ApiResponse({ status: 200, description: 'Lista de empresas adheridas el mes pasado' })
    async getJoinedLastMonth() {
        return this.getCompaniesJoinedLastMonthUseCase.execute();
    }

    @Get('transfers-last-month')
    @ApiOperation({ summary: 'Obtener empresas con transferencias en el último mes' })
    @ApiResponse({ status: 200, description: 'Lista de empresas que realizaron transferencias el mes pasado' })
    async getTransfersLastMonth() {
        return this.getCompaniesWithTransfersLastMonthUseCase.execute();
    }

    @Post('transfers')
    @ApiOperation({ summary: 'Registrar una transferencia de una empresa (util para testing del enpoint transfers-last-month)' })
    @ApiResponse({ status: 201, description: 'Transferencia registrada exitosamente' })
    @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
    async registerTransfer(@Body() dto: RegisterTransferDto) {
        return this.registerTransferUseCase.execute(dto);
    }
}
