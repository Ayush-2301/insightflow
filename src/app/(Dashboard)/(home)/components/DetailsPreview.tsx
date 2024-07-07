import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { Company } from "@/lib/types";

import { Briefcase } from "lucide-react";
import React from "react";
const social_media = {
  facebook: <Icons.facebook />,
  twitter: <Icons.twitter />,
  linkedin: <Icons.linkedin />,
  instagram: <Icons.instagram />,
  youtube: <Icons.youtube />,
};
const DetailsPreview = ({ initialData }: { initialData: Company }) => {
  const socialMediaArray = Object.keys(initialData.social_media_url || {}).map(
    (key) => {
      const socialKey = key as keyof typeof social_media;
      return {
        icon: social_media[socialKey],
        url: initialData.social_media_url?.[socialKey] || "",
      };
    }
  );
  return (
    <div className="mt-6 flex flex-col items-start min-h-full">
      <a
        href={initialData.website_url}
        target="_blank"
        className="hover:underline flex items-center space-x-2"
      >
        <h1 className="text-xl font-semibold">{initialData.name}</h1>
        <Briefcase className="w-4 h-4" />
      </a>
      <p className="text-muted-foreground text-base">
        {initialData.description}
      </p>
      <div className="flex  items-center space-x-4 justify-end mt-10">
        {socialMediaArray.map(
          ({ icon, url }, index) =>
            url !== "" && (
              <Button
                variant={"outline"}
                className="rounded-full"
                size={"icon"}
                key={index}
              >
                <a key={index} href={url} target="_blank">
                  {icon}
                </a>
              </Button>
            )
        )}
      </div>
    </div>
  );
};

export default DetailsPreview;
