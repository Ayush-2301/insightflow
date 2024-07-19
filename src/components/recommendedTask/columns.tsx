"use client";
import { RecommendedTask } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

import { Button } from "@/components/ui/button";
import CellAction from "./cell-action";

export const columns: ColumnDef<RecommendedTask>[] = [
  {
    accessorKey: "task",
    header: "Task",
    cell: ({ row }) => {
      return <p className="max-w-[1100px]">{row.getValue("task")}</p>;
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
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt")).toDateString();
      return <>{date}</>;
    },
  },
  {
    accessorKey: "clarity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Clarity
          {column.getIsSorted() === "asc" ? (
            <ArrowUpNarrowWide className="w-4 h-4" />
          ) : (
            <ArrowDownWideNarrow className="w-4 h-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center">{row.getValue("clarity")}%</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction task={row.original} />;
    },
  },
];
