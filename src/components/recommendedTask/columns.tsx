"use client";
import { RecommendedTask, StaticTasks } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  ChevronRightIcon,
  Square,
  Triangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import CellAction from "./cell-action";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
  //   accessorKey: "weightage",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         className="flex items-center self-end gap-1"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         {column.getIsSorted() === "asc" ? (
  //           <ArrowUpNarrowWide className="w-4 h-4" />
  //         ) : (
  //           <ArrowDownWideNarrow className="w-4 h-4" />
  //         )}
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <>{row.getValue("weightage")}</>,
  // },

  {
    accessorKey: "weightage",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="flex items-center gap-1">
              {column.getIsSorted() === "desc" ? (
                <ArrowUpNarrowWide className="w-4 h-4" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowDownWideNarrow className="w-4 h-4" />
              ) : (
                <ArrowUpDown className="w-4 h-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort according to priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(true)} // Toggle to ascending
              >
                <ArrowUpNarrowWide className="w-4 h-4 mr-2" />
                <span>Ascending order of priority</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(false)} // Toggle to descending
              >
                <ArrowDownWideNarrow className="w-4 h-4 mr-2" />
                <span>Descending order of priority</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    id: "actions",
    cell: ({ row }) => {
      console.log(row);
      return (
        <div className="flex justify-center">
          <CellAction
            task={row.original}
            approveTaskLoading={approveTaskLoading}
            approveTask={approveTask}
            rejectTask={rejectTask}
          />
        </div>
      );
    },
  },
];
