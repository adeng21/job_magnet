"use client";
import { db } from "../db";
import { CompanyJob } from "@/companyjob";
import { getActiveCompanyJobs } from "@/queries/companyjob";

const JobsTable = async () => {
  const data = await getActiveCompanyJobs();

  return (
    <div>
      <h3>Current Jobs</h3>
      <table>
        <tr>
          <th>Company</th>
          <th>Role</th>
          <th>Location</th>
          <th>Link</th>
        </tr>
        {data.map((job: CompanyJob) => (
          <tr key={job.id}>
            <td>{job.Company.name}</td>
            <td>{job.title}</td>
            <td>{job.location}</td>
            <td>{job.url}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};
export default JobsTable;
