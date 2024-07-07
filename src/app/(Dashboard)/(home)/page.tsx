import { createSupabaseServerClient } from "@/lib/supabase/server";
import Company from "./components/Company";
import { Company as CompanyType } from "@/lib/types";
import { getCompany } from "@/lib/actions/company";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Home() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const companyData = await getCompany();
  const isValidCompany = (company: any): company is CompanyType => {
    return company && !("error" in company) && !("message" in company);
  };

  const company = isValidCompany(companyData) ? companyData : undefined;

  return (
    <div className=" flex flex-col justify-center  w-full">
      <div className="flex items-center justify-between border-b py-8">
        <div className="flex flex-col space-y-4">
          <h1 className=" text-5xl font-bold">InsightFlow</h1>
          <p className=" text-xl text-muted-foreground max-w-[70%]">
            A cutting-edge Workflow Intelligence System designed to empower
            businesses by leveraging advanced data insights and automation
          </p>
        </div>
      </div>
      <Suspense fallback={<CompnaySkeleton />}>
        <div className="mt-6">
          <h2 className=" text-3xl  font-semibold tracking-tight">
            Hello👋 {data.user?.user_metadata.full_name}
          </h2>
          {data.user && <Company userID={data.user?.id} company={company} />}
        </div>
      </Suspense>
    </div>
  );
}

function CompnaySkeleton() {
  return (
    <div className="mt-6 space-y-2">
      <Skeleton className="h-[40px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <div className="flex  items-center  space-x-2">
          <Skeleton className="h-[30px] w-[200px]" />
          <Skeleton className="h-[30px] w-[30px] rounded-full" />
        </div>
        <Skeleton className="h-[100px] w-full rounded-xl" />
      </div>
    </div>
  );
}
