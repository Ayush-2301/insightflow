import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EditTask } from "./EditTask";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";

const TaskEditServer = async () => {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  return (
    <Suspense fallback={<Loading />}>
      {data.user?.id && <EditTask userID={data.user.id} />}
    </Suspense>
  );
};

export default TaskEditServer;

const Loading = () => {
  return (
    <Button>
      <Spinner size={"default"} />
    </Button>
  );
};
