"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

import { Company, JobKeyword, JobFollower, CompanyFollower } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { saveFollowerPreferences } from "@/mutations";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
interface FollowerData {
  companies: Company[];
  jobs: JobKeyword[];
  userFollowedCompanies: CompanyFollower[];
  userFollowedJobs: JobFollower[];
}

export function FollowerSelections({
  companies,
  jobs,
  userFollowedCompanies,
  userFollowedJobs,
}: FollowerData) {
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>(
    userFollowedCompanies.map((c) => c.companyId)
  );
  const [selectedJobs, setSelectedJobs] = useState<number[]>(
    userFollowedJobs.map((j) => j.jobKeywordId)
  );

  const [savingInProgress, setSavingInProgress] = useState(false);

  const { toast } = useToast();

  const toggleCompany = (companyId: number) => {
    if (selectedCompanies.includes(companyId)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== companyId));
    } else {
      setSelectedCompanies([...selectedCompanies, companyId]);
    }
  };

  const toggleJobs = (jobId: number) => {
    if (selectedJobs.includes(jobId)) {
      setSelectedJobs(selectedJobs.filter((j) => j !== jobId));
    } else {
      setSelectedJobs([...selectedJobs, jobId]);
    }
  };

  const ableToSave = selectedCompanies.length > 0 && selectedJobs.length > 0;

  return (
    <div className="flex flex-col p-4 justify-between">
      <h1 className="flex font-bold text-xl py-4 items-center justify-center">
        Select Jobs to Follow
      </h1>
      <div className="grid grid-cols-4 gap-8">
        {jobs.map((job) => (
          <Badge
            className={cn(
              "p-2 m-4 rounded-lg hover:shadow-md hover:cursor-pointer text-sm flex items-center justify-center w-auto",
              selectedJobs.includes(job.id) ? "bg-gray-200" : "bg-white"
            )}
            key={job.id}
            onClick={() => toggleJobs(job.id)}
            variant="secondary"
          >
            {job.title}
          </Badge>
        ))}
      </div>
      <h1 className="flex font-bold text-xl py-4 items-center justify-center">
        Select Companies to Follow
      </h1>
      <div className="grid grid-cols-6 gap-8">
        {companies.map((company) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  key={company.id}
                  className={cn(
                    "flex m-4 rounded-lg hover:shadow-md hover:cursor-pointer w-32 h-32 justify-center items-center",
                    selectedCompanies.includes(company.id)
                      ? "bg-gray-200"
                      : "bg-white"
                  )}
                  onClick={(e) => {
                    toggleCompany(company.id);
                  }}
                >
                  <Image
                    key={company.id}
                    src={`/assets/${company.name}.jpg`}
                    alt={company.name}
                    width={100}
                    height={100}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{company.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <div className="p-4 my-4">
        <Button
          onClick={() => {
            setSavingInProgress(true);
            saveFollowerPreferences(selectedJobs, selectedCompanies)
              .then(() => {
                setSavingInProgress(false);

                toast({ description: "Preferences saved!" });
              })
              .catch((e) => {
                setSavingInProgress(false);
                toast({
                  description: "Error saving preferences. Please try again.",
                });
              });
          }}
          variant="default"
          disabled={!ableToSave || savingInProgress}
          className={cn(ableToSave ? "bg-green-600" : "bg-red-600")}
        >
          {savingInProgress ? (
            <Loader2 className="w-24 animate-spin" />
          ) : ableToSave ? (
            "Save Preferences"
          ) : (
            "Select at least one company and one job"
          )}
        </Button>
      </div>
    </div>
  );
}
