"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
const TRELLO_API_KEY = process.env.NEXT_PUBLIC_TRELLO_API_KEY;
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Box } from "@/components/ui/box";

import { useState, createElement } from "react";
import { EllipsisVertical, EyeIcon, EyeOffIcon, Verified } from "lucide-react";
import {
  AccessTokenForm,
  accessTokenSchema,
  updateTrello,
  UpdateTrelloForm,
} from "../schema";
import {
  createTrelloInfo,
  deleteTrelloConfig,
  updateTrelloConfig,
} from "@/lib/actions/trello";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Spinner } from "@/components/Spinner";
import { TrelloAlertModal } from "@/components/modal/trello-alert-modal";

const IntegrationForm = ({
  access_token,
  board_id,
  boardTitle,
}: {
  access_token: string | null | undefined;
  board_id: string | null | undefined;
  boardTitle: string | undefined;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [showUpdateSettings, setShowUpdateSettings] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof accessTokenSchema>>({
    resolver: zodResolver(accessTokenSchema),
    defaultValues: {
      access_token: "",
      boardTitle: "",
    },
  });
  const updateTrelloForm = useForm<UpdateTrelloForm>({
    resolver: zodResolver(updateTrello),
    defaultValues: {
      accesstoken: "",
      boardTitle: boardTitle || "",
    },
  });

  async function onSubmit(value: AccessTokenForm) {
    setLoading(true);
    const res = await createTrelloInfo({ value });
    if (!("error" in res)) {
      toast({
        title: "Success",
        description: "Your Trello board is connected",
      });
      router.refresh();
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to connect to Trello",
      });
    }
    setLoading(false);
    form.reset();
  }

  async function onUpdate(value: UpdateTrelloForm) {
    setLoading(true);
    const res = await updateTrelloConfig({
      accesstoken: value.accesstoken,
      boardTitle: value.boardTitle,
      boardId: board_id!,
      previousAccesstoken: access_token!,
    });
    if (res?.message === "error") {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to update Trello configuration",
      });
    } else {
      setShowUpdateSettings(false);
      toast({
        title: "Trello Configuration updated",
      });
      router.push("/settings/integrations");
      router.refresh();
    }
    setLoading(false);
    updateTrelloForm.reset();
  }
  async function handleDelete() {
    setLoading(true);
    const res = await deleteTrelloConfig({
      previousAccesstoken: access_token!,
      boardId: board_id!,
    });
    if (res?.message === "error") {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to delete Trello configuration",
      });
    } else {
      toast({
        title: "Trello Configuration deleted",
      });
      setLoading(false);
      setOpen(false);
      router.push("/settings/integrations");
    }
  }

  return (
    <>
      <TrelloAlertModal
        loading={isLoading}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
      />
      <div className="grid gap-6">
        {!access_token && !board_id ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Connect to Trello
                <span>
                  <a
                    href="https://www.atlassian.com/software/trello"
                    target="_blank"
                  >
                    <Image
                      src={"/trello-icon.svg"}
                      alt="trell-icon"
                      width={100}
                      height={100}
                    />
                  </a>
                </span>
              </CardTitle>
              <CardDescription>
                Click
                <a
                  href={`https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&key=${TRELLO_API_KEY}`}
                  target="_blank"
                  className="mx-1 underline text-primary"
                >
                  here
                </a>
                to get the access token.
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="access_token"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Box className="relative">
                            <Input
                              {...field}
                              disabled={isLoading}
                              type={passwordVisibility ? "text" : "password"}
                              placeholder={"Access Token"}
                              className={`pr-12 `}
                            />
                            <Box
                              className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
                              onClick={() =>
                                setPasswordVisibility(!passwordVisibility)
                              }
                            >
                              {createElement(
                                passwordVisibility ? EyeOffIcon : EyeIcon,
                                {
                                  className: "h-6 w-6",
                                }
                              )}
                            </Box>
                          </Box>
                        </FormControl>
                        <FormDescription>
                          Paste the copied access token to allow insightflow to
                          connect with your trello account.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="boardTitle"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={"Board Title"}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription>
                            Give a Title to your board
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <Button disabled={isLoading} type="submit">
                    {isLoading ? <Spinner size="default" /> : <>Submit</>}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <>
            {!showUpdateSettings ? (
              <div className=" p-4 bg-gray-100 rounded-md">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Label className="flex items-center justify-start text-2xl font-semibold">
                        <Image
                          src={"/trello-icon.svg"}
                          alt="Trello-icon"
                          width={150}
                          height={150}
                        />
                        <Verified className="w-8 h-8 text-gray-100 fill-gray-400" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>Trello Account Connected</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <ul className="list-disc list-outside text-lg space-y-2 px-4">
                  <li>
                    Go to the <strong>Tasks</strong> page and click on a
                    particular task.
                  </li>
                  <li>
                    Open the three-dot menu{" "}
                    <EllipsisVertical className="inline-block bg-white p-1 rounded-md" />{" "}
                    and select <strong>Add Task to Trello</strong>.
                  </li>
                  <li>
                    A board named <strong>{boardTitle}</strong> is created, and
                    inside that board, a list named{" "}
                    <strong>{boardTitle} Tasks</strong> is created.
                  </li>
                  <li>
                    New cards will be added to the{" "}
                    <strong>{boardTitle} Tasks</strong> list for each connected
                    task.
                  </li>
                  <li>
                    Once a task is added to Trello, you can disconnect it to
                    stop syncing changes.
                  </li>
                </ul>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Connect to new Trello account
                    <span>
                      <a
                        href="https://www.atlassian.com/software/trello"
                        target="_blank"
                      >
                        <Image
                          src={"/trello-icon.svg"}
                          alt="trell-icon"
                          width={100}
                          height={100}
                        />
                      </a>
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Click
                    <a
                      href={`https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&key=${TRELLO_API_KEY}`}
                      target="_blank"
                      className="mx-1 underline text-primary"
                    >
                      here
                    </a>
                    to get the new access token.
                  </CardDescription>
                </CardHeader>

                <CardContent className="">
                  <Form {...updateTrelloForm}>
                    <form
                      onSubmit={updateTrelloForm.handleSubmit(onUpdate)}
                      className="space-y-8"
                    >
                      <FormField
                        control={updateTrelloForm.control}
                        name="accesstoken"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Box className="relative">
                                <Input
                                  {...field}
                                  type={
                                    passwordVisibility ? "text" : "password"
                                  }
                                  placeholder={"Access Token"}
                                  className={`pr-12 `}
                                  disabled={isLoading}
                                />
                                <Box
                                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
                                  onClick={() =>
                                    setPasswordVisibility(!passwordVisibility)
                                  }
                                >
                                  {createElement(
                                    passwordVisibility ? EyeOffIcon : EyeIcon,
                                    {
                                      className: "h-6 w-6",
                                    }
                                  )}
                                </Box>
                              </Box>
                            </FormControl>
                            <FormDescription>
                              Paste the copied access token to allow insightflow
                              to connect with your new trello account.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateTrelloForm.control}
                        name="boardTitle"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={"Board Title"}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormDescription>
                                Want to give a new Title to your board?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <Button type="submit">
                        {" "}
                        {isLoading ? <Spinner size="default" /> : <>Submit</>}
                      </Button>
                      <Button
                        variant={"outline"}
                        className="ml-2"
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          setShowUpdateSettings(!showUpdateSettings)
                        }
                      >
                        Cancel
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            {!showUpdateSettings && (
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => setShowUpdateSettings(!showUpdateSettings)}
                >
                  Update
                </Button>
                <Button
                  disabled={isLoading}
                  variant="destructive"
                  onClick={() => setOpen(true)}
                >
                  Delete
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default IntegrationForm;
