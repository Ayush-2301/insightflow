import { EditTask } from "./EditTask";
import { readUser } from "@/lib/actions";

const TaskEditServer = async () => {
  const { data } = await readUser();

  return <>{data.user?.id && <EditTask userID={data.user.id} />}</>;
};

export default TaskEditServer;
