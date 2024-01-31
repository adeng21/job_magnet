import { db } from "@/db";
import { CompanyJob } from "@/types/companyjob";
import { cache } from "react";

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
                name: true
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