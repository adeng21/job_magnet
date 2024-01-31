
type Company = {
    name: string;
}

type UserCompanyJobStatus = {
    applicationStatus: string;
}

export type CompanyJob = {
    id: number;
    url: string;
    title: string;
    location: string | null;
    createdAt: Date;
    Company: Company
    UserCompanyJobStatus: UserCompanyJobStatus[]
}