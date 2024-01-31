import { db } from "@/db";
import { JobsDataTable } from "./jobsDataTable";
import { getInterestedActiveCompanyJobs } from "@/queries/companyjob";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) redirect("/");

  const dbUser = await db.user.findUnique({ where: { id: user.id } });
  if (!dbUser) redirect("/authcallback?origin=dashboard");

  const followsACompany = await db.companyFollower.findFirst({
    where: { userId: user.id },
  });
  if (!followsACompany) redirect("/preferences");

  const followsAJob = await db.jobFollower.findFirst({
    where: { userId: user.id },
  });
  if (!followsAJob) redirect("/preferences");

  console.log(user.id);

  const data = await getInterestedActiveCompanyJobs(user.id);
  return (
    <div className="container">
      <JobsDataTable data={data} />
    </div>
  );
};
export default Page;
