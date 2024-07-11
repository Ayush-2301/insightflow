"use client";

import { type Company } from "@/lib/types";
import CompanyForm from "./CompanyForm";
import React, { useState } from "react";
import DetailsPreview from "./DetailsPreview";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Company = ({
  userID,
  company,
}: {
  userID: string;
  company: Company | undefined;
}) => {
  const [edit, setEdit] = useState(false);

  return (
    <div>
      {!company && (
        <>
          <p className=" text-muted-foreground text-lg">
            Tell us about yourself
          </p>
          <CompanyForm initialData={company} userID={userID} />
        </>
      )}
      {company && (
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
              <DetailsPreview initialData={company} />
            </Suspense>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className=" text-muted-foreground text-lg">
                  Edit your Company Details
                </p>
                <Button
                  onClick={() => setEdit(false)}
                  size="sm"
                  variant={"outline"}
                >
                  Cancel
                </Button>
              </div>
              <CompanyForm
                setEdit={setEdit}
                initialData={company}
                userID={userID}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Company;

function PreviewSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex  items-center  space-x-2">
        <Skeleton className="h-[30px] w-[200px]" />
        <Skeleton className="h-[30px] w-[30px] rounded-full" />
      </div>
      <Skeleton className="h-[100px] w-full rounded-xl" />
    </div>
  );
}
