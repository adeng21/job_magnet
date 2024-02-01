
export type Company = {
    name: string;
    id: number;
}

export type JobKeyword = {
    id: number;
    title: string;
}

export type CompanyFollower = {
    userId: string;
    companyId: number;
}

export type JobFollower = {
    userId: string;
    jobKeywordId: number;
}

export type UserCompanyJobStatus = {
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