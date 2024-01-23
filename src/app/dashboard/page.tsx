import { db } from "@/db";
import { JobsDataTable } from "./jobsDataTable";
import { getInterestedActiveCompanyJobs } from "@/queries/companyjob";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) redirect("/sign-in");

  const dbUser = await db.user.findUnique({ where: { id: user.id } });
  if (!dbUser) redirect("/authcallback?origin=dashboard");

  console.log(user.id);

  const data = await getInterestedActiveCompanyJobs(user.id);
  return (
    <div className="container">
      <JobsDataTable data={data} />
    </div>
  );
};
export default Page;
