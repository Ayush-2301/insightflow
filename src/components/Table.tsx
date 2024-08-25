"use client";
import { StaticTasks } from "@/lib/types";
import { columns } from "@/components/recommendedTask/columns";
import { DataTable } from "./recommendedTask/data-table";
import React, { useContext, useState } from "react";
import { GroupProp } from "@/app/(Dashboard)/watchlist/components/RecommendationTaskTable";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
  open,
}: {
  groupInfo: GroupProp;
  group: string;
  tasks: StaticTasks[];
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
                : groupInfo.value === "created_at"
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
        <DataTable data={tasks} columns={columns()} />
      </CollapsibleContent>
    </Collapsible>
  );
};

const Table = ({ group }: { group: GroupProp }) => {
  const { staticTasks } = useContext(RecommendedTaskContext);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTasks = staticTasks.filter((task) =>
    task.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedTasks =
    group.value !== "all"
      ? filteredTasks.reduce((groups, task) => {
          const key = task[group.value as keyof StaticTasks] as string;
          if (!groups[key]) groups[key] = [];
          groups[key].push(task);
          return groups;
        }, {} as { [key: string]: StaticTasks[] })
      : {};

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
        <DataTable columns={columns()} data={filteredTasks} />
      ) : (
        Object.entries(groupedTasks).map(([key, tasks], index) => (
          <div key={key} className="my-6 p-3 border rounded-md bg-slate-100">
            <GroupedTask
              groupInfo={group}
              group={key}
              tasks={tasks}
              open={index === 0}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Table;
