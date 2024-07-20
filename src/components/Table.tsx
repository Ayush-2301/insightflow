"use client";
import { RecommendedTask } from "@/lib/types";
import { columns } from "@/components/recommendedTask/columns";
import { DataTable } from "./recommendedTask/data-table";
import React, { useContext, useState } from "react";
import { GroupProp } from "@/app/(Dashboard)/watchlist/components/RecommendationTaskTable";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { updateRecommendedTask } from "@/lib/actions/recommended";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { RecommendedTaskContext } from "./provider/RecommendedTaskProvider";

const GroupedTask = ({
  groupInfo,
  group,
  tasks,
  approveTask,
  rejectTask,
  approveTaskLoading,
  open,
}: {
  groupInfo: GroupProp;
  group: string;
  tasks: RecommendedTask[];
  approveTask: (id: string) => void;
  rejectTask: (id: string) => void;
  approveTaskLoading: boolean;
  open: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const Icon = groupInfo.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex justify-start items-center gap-2">
          <Button variant="outline">
            <h4
              className={cn(
                `text-sm flex justify-start items-center`,
                groupInfo.value === "category" && "capitalize"
              )}
            >
              <Icon className="mr-1 h-4 w-4" />
              {groupInfo.value === "clarity"
                ? `Clarity: ${group}%`
                : groupInfo.value === "createdAt"
                ? `Created At: ${new Date(group).toDateString()}`
                : group}
              <ChevronDown
                className={cn(` w-4 h-4 ml-2`, !isOpen ? " -rotate-90" : "")}
              />
            </h4>
          </Button>
          <p className="text-muted-foreground text-sm">{tasks.length}</p>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-4">
        <DataTable
          data={tasks}
          columns={columns({ approveTask, rejectTask, approveTaskLoading })}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

const Table = ({ group }: { group: GroupProp }) => {
  const { recommendedTask, setRecommendedTask } = useContext(
    RecommendedTaskContext
  );
  const router = useRouter();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [approveTaskLoading, setApproveTaskLoading] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTasks = recommendedTask.filter((task) =>
    task.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedTasks =
    group.value !== "all"
      ? filteredTasks.reduce((groups, task) => {
          const key = task[group.value as keyof RecommendedTask] as string;
          if (!groups[key]) groups[key] = [];
          groups[key].push(task);
          return groups;
        }, {} as { [key: string]: RecommendedTask[] })
      : {};

  const updateTasksAfterAction = (id: string) => {
    setRecommendedTask((prev) => prev.filter((task) => task.task_id !== id));
    router.refresh();
  };

  const approveTask = async (id: string) => {
    setApproveTaskLoading(true);
    const status = true;
    const res = await updateRecommendedTask({ id, status });
    if ("error" in res) {
      toast({
        title: "Error approving task",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Task approved successfully",
      });
      updateTasksAfterAction(id);
    }
    setApproveTaskLoading(false);
  };

  const rejectTask = async (id: string) => {
    setApproveTaskLoading(true);
    const status = false;
    const res = await updateRecommendedTask({ id, status });
    if ("error" in res) {
      toast({
        title: "Error rejecting task",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({ title: "Task rejected successfully" });
      updateTasksAfterAction(id);
    }
    setApproveTaskLoading(false);
  };

  return (
    <div>
      <div className="flex gap-2 items-center mb-4">
        <Input
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search Recommended Tasks"
        />
        <Button>Search</Button>
      </div>
      {group.value === "all" ? (
        <DataTable
          columns={columns({
            approveTask,
            rejectTask,
            approveTaskLoading,
          })}
          data={filteredTasks}
        />
      ) : (
        Object.entries(groupedTasks).map(([key, tasks], index) => (
          <div key={key} className="my-6 p-3 border rounded-md bg-slate-100">
            <GroupedTask
              groupInfo={group}
              group={key}
              tasks={tasks}
              approveTask={approveTask}
              rejectTask={rejectTask}
              approveTaskLoading={approveTaskLoading}
              open={index === 0}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Table;
