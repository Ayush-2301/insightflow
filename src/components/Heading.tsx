import { getCompany } from "@/lib/actions/company";

import { Company as CompanyType } from "@/lib/types";

const Heading = async ({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) => {
  const company_info = await getCompany();
  const isValidCompany = (company: any): company is CompanyType => {
    return company && !("error" in company) && !("message" in company);
  };
  const company = isValidCompany(company_info) ? company_info : undefined;
  const isEmptyObject = (obj: any) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  const companyData = company && isEmptyObject(company) ? undefined : company;

  const name = companyData ? companyData.name : "InsightFlow";
  return (
    <div className="flex flex-col space-y-2">
      <h1 className=" text-5xl font-bold">
        {name}&apos;s {heading}
      </h1>
      <p className=" text-xl text-muted-foreground">{description}</p>
    </div>
  );
};

export default Heading;
