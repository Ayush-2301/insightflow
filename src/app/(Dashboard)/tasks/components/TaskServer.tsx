import { getAllTasks } from "@/lib/actions/tasks";
import React from "react";
import Tasks from "./Tasks";

const TaskServer = async () => {
  const tasks = await getAllTasks();
  if ("error" in tasks) {
    return (
      <div className="mt-6">
        <div className="py-6 px-8 bg-gray-200 flex rounded-md justify-center items-center">
          Nothing to Show
        </div>
      </div>
    );
  }
  return (
    <div className=" mt-6">
      <Tasks tasks={tasks} />
    </div>
  );
};

export default TaskServer;
