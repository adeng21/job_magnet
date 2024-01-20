"use client";
import { db } from "../db";
import { CompanyJob } from "@/companyjob";
import { getActiveCompanyJobs } from "@/queries/companyjob";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

const JobsTable = async () => {
  const data = await getActiveCompanyJobs();

  return (
    <div className="max-w-6x1 mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4">Company</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Location</th>
                <th className="pb-4">Link</th>
              </tr>
            </thead>
            <tbody>
              {data.map((job: CompanyJob) => (
                <tr className="my-2" key={job.id}>
                  <td className="py-4">
                    <Image
                      alt="company name"
                      width={60}
                      height={60}
                      src={`/assets/${job.Company.name}.jpg`}
                    />
                  </td>
                  <td className="py-4">{job.title}</td>
                  <td className="py-4">{job.location}</td>
                  <td className="py-4">
                    <Link
                      className={buttonVariants({ variant: "outline" })}
                      href={job.url}
                      target="_blank"
                    >
                      {" "}
                      Apply
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default JobsTable;
