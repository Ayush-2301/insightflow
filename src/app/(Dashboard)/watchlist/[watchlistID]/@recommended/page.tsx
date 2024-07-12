import { getRecommendedTask } from "@/lib/actions/recommended";
import Recommendedtask from "../../components/Recommendedtask";

const recommendedPage = async ({
  params,
}: {
  params: {
    watchlistID: string;
  };
}) => {
  const id = params.watchlistID;
  if (id === "new") return null;
  const recommendedTask = await getRecommendedTask({ id });

  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">Recommended Tasks</h2>
      <div className="space-y-4 mb-4">
        <Recommendedtask initialRecommendedTask={recommendedTask} />
      </div>
    </div>
  );
};

export default recommendedPage;
