import { randomUUID } from 'crypto';

type CompanyType = 'Pyme' | 'Corporativa';

interface RegisterCompanyInput {
  name: string;
  type: CompanyType;
  joinedAt?: string; // ISO 8601
}

interface RegisterCompanyOutput {
  id: string;
  name: string;
  type: CompanyType;
  joinedAt: string;
  message: string;
}

const isValidType = (type: string): type is CompanyType =>
  type === 'Pyme' || type === 'Corporativa';

export const handler = async (
  event: RegisterCompanyInput,
): Promise<RegisterCompanyOutput> => {
  if (!event || typeof event !== 'object') {
    throw new Error('Payload ausente o inválido');
  }
  const { name, type, joinedAt } = event;

  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new Error('El nombre es obligatorio');
  }
  if (!isValidType(type)) {
    throw new Error('El tipo debe ser "Pyme" o "Corporativa"');
  }
  const parsedDate = joinedAt ? new Date(joinedAt) : new Date();
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error('joinedAt debe ser una fecha ISO 8601 válida');
  }

  const company = {
    id: randomUUID(),
    name: name.trim(),
    type,
    joinedAt: parsedDate.toISOString(),
    createdAt: new Date().toISOString(),
  };

  // TODO persistir (API Nest | publicar en SQS/SNS o escribir en DynamoDB)

  return {
    id: company.id,
    name: company.name,
    type: company.type,
    joinedAt: company.joinedAt,
    message: 'Empresa registrada (pendiente de persistencia real)',
  };
};
