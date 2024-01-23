import { db } from "@/db";
import { CompanyJob } from "@/types/companyjob";
import { cache } from "react";

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