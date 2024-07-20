"use client";

import { RecommendedTask } from "@/lib/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface ContextProps {
  recommendedTask: RecommendedTask[];
  setRecommendedTask: Dispatch<SetStateAction<RecommendedTask[]>>;
}

const defaultValues: ContextProps = {
  recommendedTask: [],
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

  return (
    <RecommendedTaskContext.Provider
      value={{ recommendedTask, setRecommendedTask }}
    >
      {children}
    </RecommendedTaskContext.Provider>
  );
}
