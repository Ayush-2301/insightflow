"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const Recommendedtask = () => {
  const generateTasks = () => {
    // const newTasks: Task = {
    //   user_id: userID,
    //   status: "Not Started",
    //   priority: "Low",
    //   approved: false,
    //   deadline: new Date(),
    //   assigned_to: "To Self",
    //   created_at: new Date(),
    //   id: uuid(),
    //   title: `Dummy Task  xyz`,
    //   description: `This is the description for dummy task`,
    // };
    // setWatchlistTasks((prevTasks) => {
    //   if (prevTasks === undefined) {
    //     return [newTasks];
    //   } else return [...prevTasks, newTasks];
    // });
  };
  const approveTask = () => {
    // const updatedTasks = watchlistTasks?.map((task) =>
    //   task.id === id ? { ...task, approved: true } : task
    // );
    // setWatchlistTasks(updatedTasks);
  };

  const rejectTask = () => {
    // setWatchlistTasks(watchlistTasks?.filter((t) => t.id !== id));
  };
  return (
    <div className="flex flex-col gap-4 ">
      {[...Array(3)].map((_, index) => {
        return (
          <div
            key={index}
            className="group/pending p-4 border rounded-lg flex justify-between items-center shadow"
          >
            <div>
              <h3 className="text-xl font-semibold">Recommended Task</h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
                fuga praesentium repellendus temporibus aut, non, a doloremque
                nisi itaque facilis, eaque expedita ducimus ab porro quasi
                consequuntur quas voluptatem? Illum!
              </p>
              <p className="text-sm text-gray-400">
                Created at: {new Date().toDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={"outline"}
                className="p-2 invisible group-hover/pending:visible"
                onClick={() => approveTask()}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                className="p-2 invisible group-hover/pending:visible"
                variant="outline"
                onClick={() => rejectTask()}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Recommendedtask;
