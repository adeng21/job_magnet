'use server'

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";

export async function markCompanyJobNotInterested(companyJobId: number) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if(!user) {
        console.log('no user')
        return 
    }

    let jobStatus = await db.userCompanyJobStatus.findUnique({
        where: {
            userId_companyJobId: {
                companyJobId: companyJobId,
                userId: user.id
            }
        }})

        if(!jobStatus) {
            console.log("creating new job status")
            await db.userCompanyJobStatus.create({
                data: {
                    companyJobId: companyJobId,
                    userId: user.id,
                    interested: false
                }
            })
        } else {
            console.log("updating job status")
            await db.userCompanyJobStatus.update({ where: { userId_companyJobId: {companyJobId: companyJobId, userId: user.id }}, data: { interested: false } })
        }


}