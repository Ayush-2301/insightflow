"use client";
import { RecommendedTask } from "@/lib/types";
import { createContext, SetStateAction, useState } from "react";

interface ContextProps {
  taskID: string;
  openSheet: boolean;
  recommendedTask: RecommendedTask[];
  setRecommendedTask: React.Dispatch<SetStateAction<RecommendedTask[]>>;
  setOpenSheet: React.Dispatch<SetStateAction<boolean>>;
  setTaskID: React.Dispatch<SetStateAction<string>>;
}

const defaultValue: ContextProps = {
  taskID: "",
  openSheet: false,
  setOpenSheet: () => {},
  setTaskID: () => {},
  recommendedTask: [],
  setRecommendedTask: () => {},
};

export const Context = createContext<ContextProps>(defaultValue);

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [taskID, setTaskID] = useState<string>("");
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [recommendedTask, setRecommendedTask] = useState<RecommendedTask[]>([]);

  return (
    <Context.Provider
      value={{
        recommendedTask,
        setRecommendedTask,
        taskID,
        setTaskID,
        openSheet,
        setOpenSheet,
      }}
    >
      {children}
    </Context.Provider>
  );
}
