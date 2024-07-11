"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { Company } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyFormSchema, type CompanyForm } from "../schema";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Icons } from "@/components/icons/icons";
import { Textarea } from "@/components/ui/textarea";
import { createCompany, updateCompany } from "@/lib/actions/company";
import { Spinner } from "@/components/Spinner";

type SocialMediaKey = keyof typeof social_media;
const social_media = {
  facebook: {
    icon: <Icons.facebook />,
    placeholder: "Facebook handle URL",
  },
  twitter: {
    icon: <Icons.twitter />,
    placeholder: "Twitter handle URL",
  },
  linkedin: {
    icon: <Icons.linkedin />,
    placeholder: "Linkedin handle URL",
  },
  instagram: {
    icon: <Icons.instagram />,
    placeholder: "Instagram handle URL",
  },
  youtube: {
    icon: <Icons.youtube />,
    placeholder: "Youtube handle URL",
  },
};

const CompanyForm = ({
  initialData,
  userID,
  setEdit,
}: {
  initialData?: Company | undefined;
  userID: string;
  setEdit?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: CompanyForm = initialData
    ? initialData
    : {
        user_id: userID,
        name: "",
        description: "",
        created_at: new Date(),
        website_url: "",
        competion_urls: [
          {
            id: "1",
            url: "",
          },
        ],
        social_media_url: {
          facebook: "",
          twitter: "",
          linkedin: "",
          instagram: "",
          youtube: "",
        },
      };

  const form = useForm<CompanyForm>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
  });

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "competion_urls",
  });

  const error = form.formState.errors;

  async function update({
    newCompany,
    id,
  }: {
    newCompany: CompanyForm;
    id: string;
  }) {
    setIsLoading(true);
    const res = await updateCompany({ newCompany, id });
    setIsLoading(false);
    if ("error" in res) {
      toast({
        title: "Error updating company",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Company Details Updated",
      });

      router.push("/");
    }
  }

  async function insert({ newCompany }: { newCompany: CompanyForm }) {
    setIsLoading(true);
    const res = await createCompany({ newCompany });
    setIsLoading(false);
    if ("error" in res) {
      toast({
        title: "Error creating company",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Company Details Added",
      });

      router.push("/");
    }
  }

  const onSubmit = (data: CompanyForm) => {
    const newCompany: CompanyForm = {
      user_id: userID,
      name: data.name,
      created_at: initialData?.created_at ? initialData.created_at : new Date(),
      description: data.description,
      website_url: data.website_url,
      competion_urls: data.competion_urls,
      social_media_url: data.social_media_url,
    };
    if (initialData) {
      const id = initialData.id;
      update({ newCompany, id })
        .then(() => form.reset())
        .then(() => {
          if (setEdit) {
            setEdit(false);
          }
        });
    } else {
      insert({ newCompany })
        .then(() => form.reset())
        .then(() => {
          if (setEdit) {
            setEdit(false);
          }
        });
    }
  };

  return (
    <div className="rounded-lg p-6 border mt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Company Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    {...field}
                    placeholder="Company Pvt Ltd"
                  />
                </FormControl>
                <p className=" text-red-500">
                  {error.name && error.name.message}
                </p>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Website URL</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    {...field}
                    placeholder="https://example.com"
                  />
                </FormControl>
                <p className=" text-red-500">
                  {error.name && error.name.message}
                </p>
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-3 w-full">
            <Label className="text-lg">Competion URL</Label>
            {fields.map((item, index) => (
              <FormField
                key={item.id}
                control={form.control}
                name={`competion_urls.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input
                          disabled={isLoading}
                          {...field}
                          placeholder="Add URL"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isLoading}
                          onClick={() => remove(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <p className=" text-red-500">
                      {error.name && error.name.message}
                    </p>
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="button"
              onClick={() => append({ id: `${fields.length + 1}`, url: "" })}
              disabled={isLoading}
            >
              Add new URL
            </Button>
          </div>

          <div>
            <Label className="text-lg">Social Media</Label>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {Object.keys(social_media).map((key) => {
                const socialKey = key as SocialMediaKey;
                const { icon, placeholder } = social_media[socialKey];
                return (
                  <FormField
                    key={socialKey}
                    name={`social_media_url.${socialKey}`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex space-x-2 items-center">
                            {icon}
                            <Input
                              disabled={isLoading}
                              {...field}
                              placeholder={placeholder}
                            />
                          </div>
                        </FormControl>
                        <p className=" text-red-500">
                          {error.name && error.name.message}
                        </p>
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    {...field}
                    placeholder="Give a discription about your company..."
                    maxLength={500}
                  />
                </FormControl>
                <p className=" text-red-500">
                  {error.name && error.name.message}
                </p>
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit">
            {isLoading ? <Spinner size="lg" /> : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CompanyForm;
