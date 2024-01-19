import { db } from "@/db";
import JobsTable from "@/components/JobsTable";

const Page = async () => {
  const currentJobs = await db.companyJob.findMany({
    where: {
      active: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Company: {
        select: {
          name: true,
        },
      },
    },
  });
  return (
    <div>
      <JobsTable jobs={currentJobs} />
    </div>
  );
};
export default Page;
