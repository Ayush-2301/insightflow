"use client";
import { Calendar, ChevronRightIcon, Triangle } from "lucide-react";
import { Task } from "@/lib/types";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/components/provider/ContextProvider";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
const StatusOption = [
  { label: "Not Started", value: "Not Started", color: "bg-[#adb5bd]" },
  { label: "In Progress", value: "In Progress", color: "bg-[#0466c8]" },
  { label: "Completed", value: "Completed", color: "bg-[#55a630]" },
];

const PriorityOption = [
  { label: "Low", value: "Low", color: "bg-[#55a630]" },
  { label: "Medium", value: "Medium", color: "bg-[#ffca3a]" },
  { label: "High", value: "High", color: "bg-[#dd2d4a]" },
];
const TaskItem = ({ data }: { data: Task }) => {
  const { setTaskID } = useContext(Context);
  const router = useRouter();

  function handleRouting() {
    setTaskID(data.id);
    router.push("/tasks");
  }
  const getStatusColor = (status: string) => {
    const statusObj = StatusOption.find((option) => option.value === status);
    return statusObj ? statusObj.color : "bg-[#adb5bd]";
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = PriorityOption.find(
      (option) => option.value === priority
    );
    return priorityObj ? priorityObj.color : "bg-[#55a630]";
  };

  function formatContent(content: string): JSX.Element {
    if (content.includes("<br>")) {
      const items = content
        .replaceAll("-", "")
        .split("<br>")
        .map((item) => item.trim())
        .filter((item) => item);

      return (
        <ul>
          {items.map((item, index) => (
            <li key={index} className="list-disc list-inside">
              {item}
            </li>
          ))}
        </ul>
      );
    } else if (content.includes("•")) {
      const items = content
        .replaceAll("-", "")
        .split("•")
        .map((item) => item.trim())
        .filter((item) => item);

      return (
        <ul>
          {items.map((item, index) => (
            <li key={index} className="list-disc list-inside">
              {item}
            </li>
          ))}
        </ul>
      );
    } else if (content.includes("- ")) {
      let idx = 0;
      idx = content.indexOf("- ");

      const items = content.slice(idx + 1).split("- ");
      return (
        <ul>
          {items.map((item, index) => (
            <li key={index} className="list-disc list-inside">
              {item}
            </li>
          ))}
        </ul>
      );
    } else return <>{content}</>;
  }

  return (
    <div
      onClick={handleRouting}
      className="flex justify-between  cursor-pointer px-6 py-4 border rounded-lg shadow"
    >
      <div className=" flex flex-col space-y-1 max-w-[70%]">
        <h1 className="text-xl font-semibold">{data.title}</h1>
        <div className="text-gray-600">{formatContent(data.description)}</div>
        {/* <p
          className="text-gray-600"
          dangerouslySetInnerHTML={{ __html: data.description }}
        /> */}
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar className="w-4 h-4" />
          <p>Due Date: {new Date(data.deadline).toDateString()}</p>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex gap-3 self-end">
          <div
            className={cn(
              "px-3 py-1 rounded-full flex gap-2 items-center",
              getStatusColor(data.status)
            )}
          >
            <div className="w-4 h-4 rounded-full bg-white/40" />
            <p className="text-white/80">{data.status}</p>
          </div>
          <div
            className={cn(
              "px-3 py-1 rounded-sm flex items-center justify-center",
              getPriorityColor(data.priority)
            )}
          >
            <p className="text-white/80">{data.priority}</p>
          </div>
        </div>
        <div className="ml-4 text-gray-600 self-end">
          Assigned to : {data.assigned_to}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
