import { getCompany } from "@/lib/actions/company";
import { Company as CompanyType } from "@/lib/types";
import { getGoals } from "@/lib/actions";
import Company from "../components/Company";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { getProfile } from "@/lib/actions/profile";

const CompanyServer = async () => {
  const [profile, companyData, goals] = await Promise.all([
    getProfile(),
    getCompany(),
    getGoals(),
  ]);

  let profiledata = undefined;
  if (!("error" in profile)) {
    profiledata = profile;
  }
  const company = isValidCompany(companyData) ? companyData : undefined;

  return (
    <div className="mt-6">
      <h2 className="text-3xl font-semibold tracking-tight">
        Hello👋 {profiledata?.username}
      </h2>
      <Suspense fallback={<PreviewSkeleton />}>
        {profiledata?.username && (
          <Company userID={profiledata.id} company={company} goals={goals} />
        )}
      </Suspense>
    </div>
  );
};

const isValidCompany = (company: any): company is CompanyType => {
  return company && !("error" in company) && !("message" in company);
};

export default CompanyServer;

function PreviewSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex flex-col justify-start items-start space-y-2">
        <div className="flex space-x-2">
          <Skeleton className="h-[30px] w-[200px]" />
          <Skeleton className="h-[30px] w-[30px] rounded-full" />
        </div>
        <Skeleton className="h-[30px] w-[250px]" />
        <Skeleton className="h-[30px] w-[300px]" />
      </div>
      <Skeleton className="h-[100px] w-full rounded-xl" />
    </div>
  );
}
