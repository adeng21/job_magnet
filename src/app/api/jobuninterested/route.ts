import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { NextRequest } from "next/server"
import { db } from "@/db"

export const POST = async (req: NextRequest) => {

    const {getUser} = getKindeServerSession()
    const user = await getUser()
    const res = await req.json()
    const jobId = res.companyJobId

    console.log("hitting request")
    if (!user) {
        console.log("no user")
        return new Response("Unauthorized", {status: 401})
    }

    if (!jobId) {
        console.log("no job id")
        return new Response("Bad Request", {status: 400})
    }

    let jobStatus = await db.userCompanyJobStatus.findUnique({
        where: {
            userId_companyJobId: {
                companyJobId: jobId,
                userId: user.id
            }
        }
    })

    if(!jobStatus) {
        console.log("creating new job status")
        await db.userCompanyJobStatus.create({
            data: {
                companyJobId: jobId,
                userId: user.id,
                interested: false
            }
        })
    } else {
        console.log("updating job status")
        await db.userCompanyJobStatus.update({ where: { userId_companyJobId: {companyJobId: jobId, userId: user.id }}, data: { interested: false } })
    }

    return new Response("OK", {status: 200})

}