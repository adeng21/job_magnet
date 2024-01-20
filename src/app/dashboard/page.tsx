import { db } from "@/db";
import { JobsDataTable } from "./jobsDataTable";
import { getActiveCompanyJobs } from "@/queries/companyjob";

const Page = async () => {
  const data = await getActiveCompanyJobs();
  return (
    <div className="container">
      <JobsDataTable data={data} />
    </div>
  );
};
export default Page;
