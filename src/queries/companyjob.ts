import { db } from "@/db";
import { CompanyJob } from "@/companyjob";

export async function getActiveCompanyJobs(): Promise<CompanyJob[]> {
  return await db.companyJob.findMany({
    where: {
      active: true,
    },
    orderBy: {
        createdAt: "desc",
    },
    include: {
        Company: {
            select: {
                name: true
            }
        }
    }
  }); 
}