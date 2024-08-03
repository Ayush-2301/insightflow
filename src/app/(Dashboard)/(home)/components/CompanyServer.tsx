import { getCompany } from "@/lib/actions/company";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Company from "./Company";
import { Company as CompanyType } from "@/lib/types";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getGoals } from "@/lib/actions";

const CompanyServer = async () => {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const companyData = await getCompany();
  const goals = await getGoals();
  const isValidCompany = (company: any): company is CompanyType => {
    return company && !("error" in company) && !("message" in company);
  };

  const company = isValidCompany(companyData) ? companyData : undefined;
  return (
    <Suspense fallback={<CompnaySkeleton />}>
      <div className="mt-6">
        <h2 className=" text-3xl  font-semibold tracking-tight">
          Hello👋 {data.user?.user_metadata.full_name}
        </h2>
        {data.user && (
          <Company userID={data.user?.id} company={company} goals={goals} />
        )}
      </div>
    </Suspense>
  );
};

export default CompanyServer;

function CompnaySkeleton() {
  return (
    <div className="mt-6 space-y-2">
      <Skeleton className="h-[40px] w-[250px] rounded-xl" />
    </div>
  );
}
