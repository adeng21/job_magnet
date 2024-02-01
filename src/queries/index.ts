import { db } from "@/db";
import { CompanyJob } from "@/types";

export async function getInterestedActiveCompanyJobs(userId: string): Promise<CompanyJob[]> {
  const jobKeywordIds = await db.jobFollower.findMany({ where: {userId, following: true} });
  const companyFollowerIds = await db.companyFollower.findMany({ where: {userId, following: true} });


  return await db.companyJob.findMany({
    where: {
      active: true,
      jobKeywordId: {
        in: jobKeywordIds.map(j => j.jobKeywordId)
      },
      companyId: {
        in: companyFollowerIds.map(c => c.companyId)
      },
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