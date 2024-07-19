"use client";
import { RecommendedTask } from "@/lib/types";
import { createContext, SetStateAction, useState } from "react";

interface ContextProps {
  taskID: string;
  openSheet: boolean;
  setOpenSheet: React.Dispatch<SetStateAction<boolean>>;
  setTaskID: React.Dispatch<SetStateAction<string>>;
}

const defaultValue: ContextProps = {
  taskID: "",
  openSheet: false,
  setOpenSheet: () => {},
  setTaskID: () => {},
};

export const Context = createContext<ContextProps>(defaultValue);

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [taskID, setTaskID] = useState<string>("");
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  return (
    <Context.Provider
      value={{
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
