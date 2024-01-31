import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) redirect("/");

  const supportedCompanies = await db.company.findMany({
    where: { deactivated: false },
  });

  return (
    <div className="container">
      <div className="items-center py-4 bg-white shadow-md rounded-lg my-6">
        <div className="flex flex-col p-4 justify-between">
          <h1 className="flex font-bold text-xl py-4 items-center justify-center">
            Select Companies to Follow
          </h1>
          <div className="grid grid-cols-6 gap-8">
            {supportedCompanies.map((company) => (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      key={company.id}
                      className="flex m-4 rounded-lg hover:shadow-md w-32 h-32 justify-center items-center"
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
        </div>
      </div>
    </div>
  );
};
export default Page;
