"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const authCallback = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/authcallback`, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Api call failed", err.message);
    throw err;
  }
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    authCallback()
      .then((data) => {
        if (data.success) {
          // Handle success
          // Redirect to the dashboard or any other page
          const searchParams = useSearchParams();
          const origin = searchParams.get("origin");
          router.push(origin ? `/${origin}` : "/dashboard");
        }
      })
      .catch((err) => {
        // Handle error
        setError(err.message);
        if (err.message.includes("Unauthorized")) {
          router.push("/sign-in");
        }
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  if (isLoading) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
          <h3 className="font-semibold text-xl">Setting up your account...</h3>
          <p>You will be redirected automatically</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-semibold text-xl">Error:</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return null;
};
export default Page;
