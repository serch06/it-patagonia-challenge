export class Transfer {
    constructor(
        public id: string,
        public companyId: string,
        public amount: number,
        public date: Date,
    ) { }
}
