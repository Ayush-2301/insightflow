"use client";
import { createContext, SetStateAction, useState } from "react";

interface ContextProps {
  taskID: string;

  setTaskID: React.Dispatch<SetStateAction<string>>;
}

const defaultValue: ContextProps = {
  taskID: "",

  setTaskID: () => {},
};

export const Context = createContext<ContextProps>(defaultValue);

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [taskID, setTaskID] = useState<string>("");

  return (
    <Context.Provider
      value={{
        taskID,
        setTaskID,
      }}
    >
      {children}
    </Context.Provider>
  );
}
