"use client";
import { useTour } from "@reactour/tour";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { steps } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { ToastAction } from "@/components/ui/toast";

const InfoCard = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Info className={cn(`w-4 h-4 text-muted-foreground`, className)} />
      </HoverCardTrigger>
      <HoverCardContent
        className={cn(
          `w-80 text-sm font-normal text-muted-foreground`,
          className
        )}
      >
        {content}
      </HoverCardContent>
    </HoverCard>
  );
};

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
  const { setIsOpen } = useTour();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: CompanyForm = initialData
    ? initialData
    : {
        user_id: userID,
        name: "",
        description: "",
        goal: "",
        industry: "",
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
      industry: data.industry,
      goal: data.goal,
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

  useEffect(() => {
    toast({
      className: "flex-col gap-2",
      duration: 20000,
      title: "Need Assistance with the Form?",
      description:
        "If you need help filling out the company information form, click 'Start Guide' for a step-by-step walkthrough.",
      action: (
        <ToastAction
          altText="Start Guide"
          className="  bg-transparent border-none self-end"
          onClick={() => setIsOpen(true)}
        >
          <Button type="button">Start Guide</Button>
        </ToastAction>
      ),
    });
  }, []);
  return (
    <div className="rounded-lg p-6 border mt-4 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="company-name group/company">
                <FormLabel className="text-lg flex gap-2 items-center">
                  Company Name
                  <InfoCard
                    className="invisible group-focus-within/company:visible"
                    content={steps[0].content as string}
                  />
                </FormLabel>
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
            name="industry"
            render={({ field }) => (
              <FormItem className="industry group/industry">
                <FormLabel className="text-lg flex gap-2 items-center">
                  Industry
                  <InfoCard
                    className="invisible group-focus-within/industry:visible"
                    content={steps[1].content as string}
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    {...field}
                    placeholder="Enter industry name (e.g., Digital Marketing Agency)"
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
            name="goal"
            render={({ field }) => (
              <FormItem className="goal group/goal">
                <FormLabel className="text-lg flex items-center gap-2">
                  Goal{" "}
                  <InfoCard
                    className="invisible group-focus-within/goal:visible"
                    content={steps[2].content as string}
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    {...field}
                    placeholder="Specify your goal (e.g., Expand customer base via partnerships)"
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
              <FormItem className="website_url  group/website">
                <FormLabel className="text-lg flex items-center gap-2">
                  Website URL{" "}
                  <InfoCard
                    className="invisible group-focus-within/website:visible"
                    content={steps[3].content as string}
                  />
                </FormLabel>
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
          <div className="flex flex-col space-y-3 w-full competion_url group/competion">
            <Label className="text-lg flex items-center gap-2">
              Competion URL{" "}
              <InfoCard
                className="invisible group-focus-within/competion:visible"
                content={steps[4].content as string}
              />
            </Label>
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

          <div className="social-media group/social">
            <Label className="text-lg flex items-center gap-2">
              Social Media{" "}
              <InfoCard
                className="invisible group-focus-within/social:visible"
                content={steps[5].content as string}
              />
            </Label>
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
              <FormItem className="description group/description">
                <FormLabel className="text-lg flex items-center gap-2">
                  Description{" "}
                  <InfoCard
                    className="invisible group-focus-within/description:visible"
                    content={steps[6].content as string}
                  />
                </FormLabel>
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
