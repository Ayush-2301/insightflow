"use client";
import React, { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { AlertModal } from "@/components/modal/alert-modal";
import { watchlistFormSchema, type WatchlistForm } from "../schema";
import KeywordSearch from "./KeywordSearch";
import { Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-input";
import type { Task, Watchlist } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Keyword } from "@/lib/types";
import {
  createWatchlist,
  deleteWatchlist,
  updateWatchlist,
} from "@/lib/actions/watchlist";
import { Spinner } from "@/components/Spinner";

const WatchlistForm = ({
  initialData,
  userID,
  suggestedKeywords,
}: {
  initialData: Watchlist | undefined;
  userID: string;
  suggestedKeywords: Keyword[] | undefined;
}) => {
  const { toast } = useToast();
  const params: {
    watchlistID: string;
  } = useParams();

  const router = useRouter();
  const titleInputRef = useRef<HTMLInputElement>(null);

  const action = initialData ? "Save Changes" : "Create";
  const defaultValues: WatchlistForm = initialData
    ? initialData
    : {
        user_id: userID,
        title: "",
        keywords: [],
        createdAt: new Date(),
      };

  const [watchlistTasks, setWatchlistTasks] = useState<Task[] | undefined>(
    initialData ? initialData.tasks : []
  );
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<WatchlistForm>({
    resolver: zodResolver(watchlistFormSchema),
    defaultValues,
  });

  const error = form.formState.errors;

  async function update({
    newWatchList,
    watchlistTasks,
    id,
  }: {
    newWatchList: WatchlistForm;
    watchlistTasks: Task[] | undefined;
    id: string;
  }) {
    setIsLoading(true);
    const res = await updateWatchlist({ newWatchList, id });
    setIsLoading(false);
    if ("error" in res) {
      toast({
        title: "Error updating watchlist",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Watchlist updated successfully",
      });
      router.push(`/watchlist/${initialData?.id}`);
      router.refresh();
    }
  }
  async function create({ newWatchList }: { newWatchList: WatchlistForm }) {
    setIsLoading(true);
    const res = await createWatchlist({ newWatchList });
    setIsLoading(false);
    if ("error" in res) {
      toast({
        title: "Error creating watchlist",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Watchlist created successfully",
      });
      router.push(`/watchlist/${res.watchlist.id}`);
    }
  }

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const handleSaveAction = () => {
    const newWatchList: WatchlistForm = {
      user_id: userID,
      createdAt: initialData ? initialData.createdAt : new Date(),
      title: form.getValues("title"),
      keywords: form.getValues("keywords"),
    };

    if (newWatchList.title === "") {
      toast({
        variant: "destructive",
        description: "Title must be specified",
      });
      return null;
    } else if (newWatchList.keywords.length <= 0) {
      toast({
        variant: "destructive",
        description: "At least one keyword must be specified",
      });
      return null;
    }

    if (initialData) {
      const id = initialData.id;
      update({ newWatchList, watchlistTasks, id });
    } else {
      create({ newWatchList });
    }
  };
  async function handleDelete() {
    const id = params.watchlistID;
    setIsLoading(true);
    const res = await deleteWatchlist({ id });
    setIsLoading(false);
    if ("error" in res) {
      toast({
        title: "Error deleting watchlist",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Watchlist deleted successfully",
      });
      router.push("/watchlist");
    }
  }

  const handleSelectKeyword = (keyword: Keyword) => {
    const currentKeywords = form.getValues("keywords");
    form.setValue("keywords", [...currentKeywords, keyword]);
  };
  const handleRemoveKeyword = (keywordId: string) => {
    const currentKeywords = form.getValues("keywords");
    form.setValue(
      "keywords",
      currentKeywords.filter((keyword) => keyword.id !== keywordId)
    );
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={isLoading}
      />

      <div className="flex flex-col h-full justify-between items-start py-4 space-y-8 w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSaveAction)}
            className="w-full space-y-8"
          >
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="text-4xl font-bold tracking-tight bg-transparent w-full truncate placeholder:text-gray-300"
                        disabled={isLoading}
                        placeholder="Watchlist Title"
                        {...field}
                        ref={titleInputRef}
                      />
                    </FormControl>
                    <p className=" text-red-500">
                      {error.title && error.title.message}
                    </p>
                  </FormItem>
                )}
              />
              {initialData && (
                <Button
                  disabled={isLoading}
                  variant="destructive"
                  size="sm"
                  onClick={() => setOpen(true)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-2xl font-semibold">
                    Search Keywords
                  </FormLabel>
                  <FormDescription className=" ">
                    Selected Keywords to generate related tasks
                  </FormDescription>
                  {field.value && (
                    <div className="flex flex-wrap mt-2">
                      {field.value.map((keyword: Keyword) => (
                        <span
                          key={keyword.id}
                          className={`px-2 py-1 rounded-full mr-2 mb-2 shadow flex items-center capitalize ${
                            keyword.approve === false
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {keyword.keyword}
                          <button
                            type="button"
                            className="ml-2"
                            onClick={() => handleRemoveKeyword(keyword.id)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <FormControl>
                    <div className="flex justify-between w-full gap-3">
                      <KeywordSearch
                        onSelect={handleSelectKeyword}
                        selectedKeywords={field.value}
                        suggestedKeywords={suggestedKeywords}
                        isLoading={isLoading}
                      />
                    </div>
                  </FormControl>
                  <p className=" text-red-500">
                    {error.keywords && error.keywords.message}
                  </p>
                </FormItem>
              )}
            />
          </form>
        </Form>
        {/* {watchlistTasks && watchlistTasks.length > 0 && (
          <div className="w-full mt-8">
            <h2 className="text-2xl font-bold mb-4">Generated Tasks</h2>
            <div className="space-y-4 mb-4">
              {watchlistTasks.map((task) => {
                if (task.approved === false)
                  return (
                    <div
                      key={task.id}
                      className="group/pending p-4 border rounded-lg flex justify-between items-center shadow"
                    >
                      <div>
                        <h3 className="text-xl font-semibold">{task.title}</h3>
                        <p className="text-gray-600">{task.description}</p>
                        <p className="text-sm text-gray-400">
                          Created at: {task.created_at.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant={"outline"}
                          className="p-2 invisible group-hover/pending:visible"
                          onClick={() => approveTask(task)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          className="p-2 invisible group-hover/pending:visible"
                          variant="outline"
                          onClick={() => rejectTask(task)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
              })}
            </div>
            <Button onClick={generateTasks}>Generate More</Button>
          </div>
        )}
        {watchlistTasks && watchlistTasks.length > 0 && (
          <div className="w-full mt-8">
            <h2 className="text-2xl font-bold mb-4">Assigned Tasks</h2>
            <div className="space-y-4 mb-4">
              {watchlistTasks.map(
                (task) =>
                  task.approved && <TaskItem data={task} key={task.id} />
              )}
            </div>
          </div>
        )} */}
        <Button className="self-end " type="submit" onClick={handleSaveAction}>
          {isLoading ? <Spinner size="default" /> : action}
        </Button>
      </div>
    </>
  );
};

export default WatchlistForm;
