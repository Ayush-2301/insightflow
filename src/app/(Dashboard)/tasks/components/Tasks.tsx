"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import TaskItem from "./TaskItem";
import { SelectComponent } from "./SelectComponent";
import { AssigneeComponent } from "./AssigneeComponent";
import { Task } from "@/lib/types";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const statusOptions = [
  { label: "Not Started", value: "Not Started" },
  { label: "In Progress", value: "In Progress" },
  { label: "Done", value: "Done" },
];

const priorityOptions = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

const Tasks = ({ tasks }: { tasks: Task[] | undefined }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks || []);

  useEffect(() => {
    let updatedTasks = tasks || [];
    if (searchQuery) {
      updatedTasks = updatedTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedStatus) {
      updatedTasks = updatedTasks.filter(
        (task) => task.status === selectedStatus
      );
    }
    if (selectedPriority) {
      updatedTasks = updatedTasks.filter(
        (task) => task.priority === selectedPriority
      );
    }
    setFilteredTasks(updatedTasks);
  }, [searchQuery, selectedStatus, selectedPriority, tasks]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex gap-3">
        <Input
          placeholder="Search Tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SelectComponent
          placeholder="Status"
          label="Status"
          options={statusOptions}
          onValueChange={(value) => setSelectedStatus(value)}
        />
        <SelectComponent
          placeholder="Priority"
          label="Priority"
          options={priorityOptions}
          onValueChange={(value) => setSelectedPriority(value)}
        />
        <AssigneeComponent />
      </div>
      <Suspense fallback={<TaskSkeleton />}>
        {filteredTasks.length === 0 ? (
          <div className="py-6 px-8 bg-gray-200 flex rounded-md justify-center items-center">
            Nothing to Show
          </div>
        ) : (
          filteredTasks.map((item) => {
            return <TaskItem key={item.id} data={item} />;
          })
        )}
      </Suspense>
    </div>
  );
};

export default Tasks;

export function TaskSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      {[...Array(5)].map((_, index) => (
        <>
          <div className="bg-white rounded-lg p-4 flex  items-start  space-y-2 shadow justify-between">
            <div className="flex flex-col space-y-2 items-start">
              <Skeleton className="h-[30px] w-[250px] rounded-md" />
              <Skeleton className="h-[30px] w-[500px] rounded-md" />
              <Skeleton className="h-[30px] w-[300px] rounded-md" />
            </div>
            <div className="flex flex-col justify-between space-y-8">
              <div className="flex space-x-2 ">
                <Skeleton className="h-[30px] w-[100px] rounded-md" />
                <Skeleton className="h-[30px] w-[60px] rounded-sm" />
              </div>
              <Skeleton className="h-[30px] w-[150px] rounded-md" />
            </div>
          </div>
        </>
      ))}
    </div>
  );
}
