import { getStaticTask } from "@/lib/actions/recommended";
import Recommendedtask from "../../components/Recommendedtask";
import RecommendedTaskProvider from "@/components/provider/RecommendedTaskProvider";
import { Suspense } from "react";
import { WatchlistsSkeleton } from "../../components/Watchlists";

const recommendedPage = async ({
  params,
}: {
  params: {
    watchlistID: string;
  };
}) => {
  const id = params.watchlistID;
  if (id === "new") return null;
  const staticTasks = await getStaticTask({ id });
  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">Recommended Tasks</h2>
      <div className="space-y-4 mb-4">
        <RecommendedTaskProvider>
          <Suspense fallback={<WatchlistsSkeleton />}>
            <Recommendedtask staticTasks={staticTasks?.paginatedResult} />
          </Suspense>
        </RecommendedTaskProvider>
      </div>
    </div>
  );
};

export default recommendedPage;
