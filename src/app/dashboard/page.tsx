import { db } from "@/db";
import JobsTable from "@/components/JobsTable";

const Page = () => {
  return (
    <div className="container mx-auto p-8 bg-gray-100">
      <JobsTable />
    </div>
  );
};
export default Page;
