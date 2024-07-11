import TaskEditServer from "./components/TaskEditServer";
import TaskServer from "./components/TaskServer";

const TasksPage = async () => {
  return (
    <div className=" flex flex-col justify-center  w-full">
      <div className="flex items-center justify-between border-b py-8">
        <div className="flex flex-col space-y-2">
          <h1 className=" text-5xl font-bold">InsightFlow Task Management</h1>
          <p className=" text-xl text-muted-foreground">Manage your tasks</p>
        </div>
        <TaskEditServer />
      </div>
      <TaskServer />
    </div>
  );
};

export default TasksPage;
