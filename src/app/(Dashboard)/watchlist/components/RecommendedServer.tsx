import { getStaticTask } from "@/lib/actions/recommended";
import Recommendedtask from "./Recommendedtask";
import RecommendedTaskProvider from "@/components/provider/RecommendedTaskProvider";

const RecommendedServer = async ({ id }: { id: string }) => {
  // let recommendedTask;
  // if (id) {
  //   recommendedTask = await getRecommendedTask({
  //     id,
  //     page: "1",
  //     pagesize: "10",
  //   });
  // }
  let staticTasks;
  if (id) {
    staticTasks = await getStaticTask({ id });
  }

  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">Recommended Tasks</h2>
      <div className="space-y-4 mb-4">
        <RecommendedTaskProvider>
          <Recommendedtask staticTasks={staticTasks?.paginatedResult} />
        </RecommendedTaskProvider>
      </div>
    </div>
  );
};

export default RecommendedServer;
