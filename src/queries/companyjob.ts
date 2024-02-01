import { db } from "@/db";
import { CompanyJob } from "@/types";

export async function getInterestedActiveCompanyJobs(userId: string): Promise<CompanyJob[]> {
  return await db.companyJob.findMany({
    where: {
      active: true,
      UserCompanyJobStatus: {
        every: {
          interested: true,
        }
      }
    },
    orderBy: {
        createdAt: "desc",
    },
    include: {
        Company: {
            select: {
                name: true,
                id: true
            }
        },
        UserCompanyJobStatus: {
            where: {
                userId: userId
            },
            select: {
              applicationStatus: true,
            }
        }
    }
  }); 
}