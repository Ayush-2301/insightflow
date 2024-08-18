"use client";
import { TourProvider } from "@reactour/tour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { Goal, type Company } from "@/lib/types";
import CompanyForm from "./CompanyForm";
import React, { useState } from "react";
import DetailsPreview from "./DetailsPreview";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { steps } from "@/lib/constant";

const Company = ({
  userID,
  company,
  goals,
}: {
  userID: string;
  company: Company | undefined;
  goals: Goal[] | undefined;
}) => {
  const [edit, setEdit] = useState(false);
  const disableBody = (target: HTMLElement | Element | null) => {
    if (target) {
      disableBodyScroll(target);
    }
  };

  const enableBody = (target: HTMLElement | Element | null) => {
    if (target) {
      enableBodyScroll(target);
    }
  };
  const isEmptyObject = (obj: any) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  const companyData = company && isEmptyObject(company) ? undefined : company;

  return (
    <TourProvider
      styles={{
        popover: (base) => ({
          ...base,
          "--reactour-accent": "#35185A",
          borderRadius: 10,
        }),
        maskArea: (base) => ({ ...base, rx: 10 }),
      }}
      steps={steps}
      showBadge={false}
      afterOpen={disableBody}
      beforeClose={enableBody}
      className="rounded-md"
      scrollSmooth
      startAt={0}
      padding={5}
    >
      <div>
        {!companyData && (
          <>
            <p className=" text-muted-foreground text-lg">
              Tell us about yourself
            </p>
            <CompanyForm
              initialData={companyData}
              userID={userID}
              goals={goals}
            />
          </>
        )}
        {companyData && (
          <>
            {!edit ? (
              <Suspense fallback={<PreviewSkeleton />}>
                <div className="flex justify-between items-center">
                  <p className=" text-muted-foreground text-lg">
                    Your Company Details
                  </p>
                  <Button
                    onClick={() => setEdit(true)}
                    variant={"outline"}
                    size="sm"
                  >
                    Edit
                  </Button>
                </div>
                <DetailsPreview initialData={companyData} />
              </Suspense>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <p className=" text-muted-foreground text-lg">
                    Edit your Company Details
                  </p>
                </div>
                <CompanyForm
                  setEdit={setEdit}
                  initialData={companyData}
                  userID={userID}
                  goals={goals}
                />
              </>
            )}
          </>
        )}
      </div>
    </TourProvider>
  );
};

export default Company;

function PreviewSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex  flex-col  justify-start items-start space-y-2">
        <div className="flex  space-x-2">
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
