import { getRecommendedTask } from "@/lib/actions/recommended";
import Recommendedtask from "../../components/Recommendedtask";
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
  // const recommendedTask = await getRecommendedTask({
  //   id,
  //   page: "1",
  //   pagesize: "10",
  // });

  // console.log("hello", recommendedTask);
  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">Recommended Tasks</h2>
      <div className="space-y-4 mb-4">
        <Suspense fallback={<WatchlistsSkeleton />}>
          {/* <Recommendedtask initialRecommendedTask={recommendedTask!} /> */}
          <Recommendedtask id={id} />
        </Suspense>
      </div>
    </div>
  );
};

export default recommendedPage;
