"use client";
import { RecommendedTask, StaticTasks } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronRightIcon,
  Square,
  Triangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import CellAction from "./cell-action";

export const columns = ({
  approveTask,
  rejectTask,
  approveTaskLoading,
}: {
  approveTask: (id: string) => void;
  rejectTask: (id: string) => void;
  approveTaskLoading: boolean;
}): ColumnDef<StaticTasks>[] => [
  {
    accessorKey: "task",
    header: "Task",
    cell: ({ row }) => {
      function formatContent(content: string): JSX.Element {
        if (content.includes("<br>")) {
          const items = content
            .replaceAll("-", "")
            .split("<br>")
            .map((item) => item.trim());

          return (
            <ul className="px-4">
              {items.map((item, index) => (
                <li key={index} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>
          );
        } else if (content.includes("- ")) {
          const idx = content.indexOf("- ");
          const items = content.slice(idx + 1).split("- ");

          return (
            <ul className="px-4">
              {items.map((item, index) => (
                <li key={index} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>
          );
        } else return <>{content}</>;
      }
      return <>{formatContent(row.getValue("task"))}</>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <p className=" capitalize">{row.getValue("category")}</p>;
    },
  },
  {
    accessorKey: "domain",
    header: "Domain",
    cell: ({ row }) => {
      return (
        <a
          href={`https://${row.getValue("domain")}`}
          className="hover:underline"
          target="_blank"
        >
          {row.getValue("domain")}
        </a>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at")).toDateString();
      return <>{date}</>;
    },
  },
  // {
  //   accessorKey: "clarity",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         className="flex items-center gap-1"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Clarity
  //         {column.getIsSorted() === "asc" ? (
  //           <ArrowUpNarrowWide className="w-4 h-4" />
  //         ) : (
  //           <ArrowDownWideNarrow className="w-4 h-4" />
  //         )}
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     return <p className="text-center">{row.getValue("clarity")}%</p>;
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <CellAction
          task={row.original}
          approveTaskLoading={approveTaskLoading}
          approveTask={approveTask}
          rejectTask={rejectTask}
        />
      );
    },
  },
];
