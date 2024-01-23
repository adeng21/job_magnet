'use server'

import { error } from "console"
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export async function markCompanyJobNotInterested(companyJobId: number) {
    await fetch(`${baseUrl}/api/jobuninterested`, {
        method: 'POST',
        body: JSON.stringify({companyJobId}),

    }).then(res => res.json()).catch(error => console.error(error))

}