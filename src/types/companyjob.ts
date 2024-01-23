
type Company = {
    name: string;
}

export type CompanyJob = {
    id: number;
    url: string;
    title: string;
    location: string | null;
    createdAt: Date;
    Company: Company
}