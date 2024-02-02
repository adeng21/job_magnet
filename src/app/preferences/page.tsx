import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { FollowerSelections } from "./followerSelections";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) redirect("/");

  const supportedCompanies = await db.company.findMany({
    where: { deactivated: false },
    orderBy: { name: "asc" },
  });

  const supportedJobKeywords = await db.jobKeyword.findMany();

  const userFollowedCompanies = await db.companyFollower.findMany({
    where: { userId: user.id, following: true },
  });

  const userFollowedJobs = await db.jobFollower.findMany({
    where: { userId: user.id, following: true },
  });

  const userLocations = await db.userLocationPreference.findMany({
    where: { userId: user.id },
  });

  return (
    <div className="container">
      <div className="items-center py-4 bg-white shadow-md rounded-lg my-6">
        <FollowerSelections
          companies={supportedCompanies}
          jobs={supportedJobKeywords}
          userFollowedCompanies={userFollowedCompanies}
          userFollowedJobs={userFollowedJobs}
          userLocations={userLocations.map((location) => location.locationArea)}
        />
      </div>
    </div>
  );
};
export default Page;
