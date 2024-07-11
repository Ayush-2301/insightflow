import React from "react";
import TaskItem from "../../tasks/components/TaskItem";
import { getAllTaskByWatchlistID } from "@/lib/actions/tasks";

const ApprovedTask = async ({ watchlistID }: { watchlistID: string }) => {
  const tasks = await getAllTaskByWatchlistID({ watchlistID });
  if ("error" in tasks) return null;
  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">Assigned Tasks</h2>
      <div className="space-y-4 mb-4">
        {tasks.map((task) => (
          <TaskItem data={task} key={task.id} />
        ))}
      </div>
    </div>
  );
};

export default ApprovedTask;
