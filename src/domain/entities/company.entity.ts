export enum CompanyType {
  PYME = 'Pyme',
  CORPORATIVA = 'Corporativa',
}

export class Company {
  constructor(
    public id: string,
    public name: string,
    public type: CompanyType,
    public joinedAt: Date,
  ) {}
}
