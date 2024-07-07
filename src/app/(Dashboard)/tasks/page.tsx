import Tasks from "./components/Tasks";
import { EditTask } from "./components/EditTask";
import { getAllTasks } from "@/lib/actions/tasks";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const TasksPage = async () => {
  const tasks = await getAllTasks();
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return (
    <div
      suppressHydrationWarning
      className=" flex flex-col justify-center  w-full"
    >
      <div className="flex items-center justify-between border-b py-8">
        <div className="flex flex-col space-y-2">
          <h1 className=" text-5xl font-bold">InsightFlow Task Management</h1>
          <p className=" text-xl text-muted-foreground">Manage your tasks</p>
        </div>
        {data.user?.id && <EditTask userID={data.user.id} />}
      </div>
      <div className=" mt-6">
        <Tasks tasks={tasks} />
      </div>
    </div>
  );
};

export default TasksPage;
