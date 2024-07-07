"use client";
import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, type TaskForm } from "../schema";
import { useForm } from "react-hook-form";
import { AlertModal } from "@/components/modal/alert-modal";
import { Input } from "@/components/ui/custom-input";
import { Input as OriginalInput } from "@/components/ui/input";
import { TaskSelectComponent } from "./TaskSelectComponent";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuid } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Trash,
  Loader,
  LucideCirclePlay,
  UsersIcon,
  CalendarIcon,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";
import { Context } from "@/components/provider/ContextProvider";
import type { Task } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { deleteTask, insertTask, updateTask } from "@/lib/actions/tasks";
import { Skeleton } from "@/components/ui/skeleton";

const StatusOption = [
  { label: "Not Started", value: "Not Started", color: "#adb5bd" },
  { label: "In Progress", value: "In Progress", color: "#0466c8" },
  { label: "Completed", value: "Completed", color: "#55a630" },
];
const PriorityOption = [
  {
    label: "Low",
    value: "Low",
    color: "#55a630",
  },
  {
    label: "Medium",
    value: "Medium",
    color: "#ffca3a",
  },
  {
    label: "High",
    value: "High",
    color: "#dd2d4a",
  },
];

const TaskForm = ({
  initialData,
  taskID,
  userID,
}: {
  initialData: Task | null;
  taskID?: string;
  userID: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const title = initialData ? "Edit Task" : "Create Task";
  const description = initialData
    ? "Make changes to your task here. Click save when you're done.."
    : "Create a new custom task and set other parameters";
  const action = initialData ? "Save changes" : "Create";
  const defaultValues: TaskForm = initialData
    ? initialData
    : {
        user_id: "",
        title: "",
        description: "",
        status: "Not Started",
        approved: false,
        priority: "Low",
        deadline: new Date(),
        assigned_to: "To Self",
        created_at: new Date(),
      };
  if (defaultValues.description === "No Description Provided") {
    defaultValues.description = "";
  }
  const form = useForm<TaskForm>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  const isLoading = form.formState.isLoading;

  async function update({
    newTask,
    taskID,
  }: {
    newTask: TaskForm;
    taskID: string;
  }) {
    const res = await updateTask({ newTask, taskID });
    if ("error" in res) {
      toast({
        title: "Error updating task",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Task updated successfully",
      });
      router.refresh();
      router.push("/tasks");
    }
  }
  async function insert({ newTask }: { newTask: TaskForm }) {
    const res = await insertTask({ newTask });
    if ("error" in res) {
      toast({
        title: "Error creating task",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Task created successfully",
      });
      router.refresh();
      router.push("/tasks");
    }
  }
  const onSubmit = () => {
    const newTask: TaskForm = {
      user_id: userID,
      created_at: initialData ? initialData.created_at : new Date(),
      title: form.getValues("title"),
      description: form.getValues("description") || "No Description Provided",
      status: form.getValues("status") || "Not Started",
      priority: form.getValues("priority") || "Low",
      approved: false,
      deadline: form.getValues("deadline") || new Date(),
      assigned_to: form.getValues("assigned_to") || "To Self",
    };
    if (initialData) {
      if (taskID) update({ newTask, taskID });
    } else {
      insert({ newTask });
    }
  };
  async function deleteDetail(id: string) {
    const res = await deleteTask({ id });
    if ("error" in res) {
      toast({
        title: "Error deleting task",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Task deleted successfully",
      });
    }
  }
  const onDelete = () => {
    if (initialData) {
      deleteDetail(initialData.id);
      setOpen(false);
      router.push("/tasks");
    }
  };
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <div className="flex flex-col items-start py-4  space-y-8 ">
        <div className="flex justify-between  w-full item-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {initialData && (
            <Button
              disabled={isLoading}
              variant="destructive"
              className="mr-6"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Form {...form}>
          <form className="w-full space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Button
                    type="button"
                    variant={"ghost"}
                    className=" justify-start  pl-1"
                  >
                    <FormControl>
                      <Input
                        className="text-2xl font-bold tracking-tight bg-transparent placeholder:text-gray-300"
                        disabled={isLoading}
                        placeholder="Task Title"
                        {...field}
                        ref={titleInputRef}
                      />
                    </FormControl>
                  </Button>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex gap-x-3 items-center">
                  <FormLabel className="flex gap-1 items-center mt-2 ">
                    <Loader className="w-4 h-4" /> Status
                  </FormLabel>
                  <FormControl>
                    <TaskSelectComponent
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      type="status"
                      options={StatusOption}
                      defaultValue={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="flex gap-x-3 items-center">
                  <FormLabel className="flex gap-1 items-center mt-2 ">
                    <LucideCirclePlay className="w-4 h-4 rotate-90" /> Priority
                  </FormLabel>
                  <FormControl>
                    <TaskSelectComponent
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      type="priority"
                      options={PriorityOption}
                      defaultValue={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assigned_to"
              render={({ field }) => (
                <FormItem className="flex gap-x-3 items-center">
                  <FormLabel className="flex gap-1 items-center mt-2">
                    <UsersIcon className="w-4 h-4" /> Assignee
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost">
                          {field.value ? field.value : "Empty"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Assignee
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Enter the email to assigned task.
                            </p>
                          </div>
                          <div className="">
                            <OriginalInput
                              disabled={isLoading}
                              placeholder="example@xyz.com"
                              {...field}
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex gap-x-3 items-center">
                  <FormLabel className="flex gap-1 items-center mt-2">
                    <CalendarIcon className="w-4 h-4" /> Due
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"ghost"}
                          className={cn(
                            " justify-start pl-3  text-start font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-xl font-bold tracking-tight">
                    About this task
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Give a description about this task..."
                      className="resize-none  outline-none  border-none px-0"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end">
              <SheetClose>
                <Button
                  disabled={isLoading}
                  className="border"
                  onClick={onSubmit}
                >
                  {action}
                </Button>
              </SheetClose>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default TaskForm;
