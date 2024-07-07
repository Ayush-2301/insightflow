"use client";

import { type Company } from "@/lib/types";
import CompanyForm from "./CompanyForm";
import React, { useState } from "react";
import DetailsPreview from "./DetailsPreview";
import { Button } from "@/components/ui/button";

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
            <>
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
            </>
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
