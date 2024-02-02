'use server'

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";
import { ApplicationStatus, LocationArea } from "@prisma/client";

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

export async function updateApplicationStatus(companyJobId: number, applicationStatus: ApplicationStatus | undefined) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if(!user) {
        console.log('no user')
        return 
    }

    if(!applicationStatus) {
        console.log('no application status')
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
             jobStatus = await db.userCompanyJobStatus.create({
                data: {
                    companyJobId: companyJobId,
                    userId: user.id,
                    applicationStatus: applicationStatus
                }
            })
        } else {
            console.log("updating job status")
            await db.userCompanyJobStatus.update({ where: { userId_companyJobId: {companyJobId: companyJobId, userId: user.id }}, data: { applicationStatus: applicationStatus } })
        }
    // return new status    
    return applicationStatus
}

export async function saveFollowerPreferences(jobKeywordIds: number[], companyIds: number[], locations: LocationArea[]) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if(!user) {
        console.log('no user')
        return 
    }

    // turn off old follower preferences
    const oldCompanyFollowers = await db.companyFollower.updateMany({ 
        where: { 
            userId: user.id, 
            companyId: { 
                notIn: companyIds 
            }
        }, 
        data: { following: false }
    })

    const oldJobFollowers = await db.jobFollower.updateMany({
        where: {
            userId: user.id,
            jobKeywordId: {
                notIn: jobKeywordIds
            }
        },
        data: { following: false },
    })

    const oldLocations = await db.userLocationPreference.deleteMany({
        where: {
            userId: user.id,
            locationArea: {
                notIn: locations
            }
        }
    })

    // create new follower preferences
    companyIds.forEach(async (companyId) => {
        let userCompany = await db.companyFollower.findUnique({ where: { companyId_userId: { userId: user.id, companyId: companyId } }})
        if(!userCompany) {
            console.log("creating new user company")
            await db.companyFollower.create({ data: { userId: user.id, companyId: companyId, following: true } })
        } else if(!userCompany.following) {
            console.log("updating user company following")
            await db.companyFollower.update({ where: { companyId_userId: { companyId: companyId, userId: user.id }}, data: { following: true } })
        }
    })

    jobKeywordIds.forEach(async (jobKeywordId) => {
        let userJobKeyword = await db.jobFollower.findUnique({ where: { userId_jobKeywordId: { userId: user.id, jobKeywordId: jobKeywordId } }})
        if(!userJobKeyword) {
            console.log("creating new user job keyword")
            await db.jobFollower.create({ data: { userId: user.id, jobKeywordId: jobKeywordId, following: true} })
        } else if(!userJobKeyword.following) {
            console.log("updating user job keyword following")
            await db.jobFollower.update({ where: { userId_jobKeywordId: { jobKeywordId: jobKeywordId, userId: user.id }}, data: { following: true } })
        }
    })

    locations.forEach(async (location) => {
        let userLocation = await db.userLocationPreference.findUnique({ where: { userId_locationArea: { userId: user.id, locationArea: location } }})
        if(!userLocation) {
            console.log("creating new user location")
            await db.userLocationPreference.create({ data: { userId: user.id, locationArea: location } })
        }
    })
}