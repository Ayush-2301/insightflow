"use client";

import { RecommendedTask, StaticTasks } from "@/lib/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface ContextProps {
  recommendedTask: RecommendedTask[];
  staticTasks: StaticTasks[];
  setRecommendedTask: Dispatch<SetStateAction<RecommendedTask[]>>;
  setStaticTasks: Dispatch<SetStateAction<StaticTasks[]>>;
}

const defaultValues: ContextProps = {
  recommendedTask: [],
  staticTasks: [],
  setStaticTasks: () => {},
  setRecommendedTask: () => {},
};

export const RecommendedTaskContext =
  createContext<ContextProps>(defaultValues);

export default function RecommendedTaskProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [recommendedTask, setRecommendedTask] = useState<RecommendedTask[]>([]);
  const [staticTasks, setStaticTasks] = useState<StaticTasks[]>([]);

  return (
    <RecommendedTaskContext.Provider
      value={{
        recommendedTask,
        setRecommendedTask,
        setStaticTasks,
        staticTasks,
      }}
    >
      {children}
    </RecommendedTaskContext.Provider>
  );
}
