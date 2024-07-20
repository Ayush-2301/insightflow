import Recommendedtask from "../../components/Recommendedtask";
import RecommendedTaskProvider from "@/components/provider/RecommendedTaskProvider";

const recommendedPage = async ({
  params,
}: {
  params: {
    watchlistID: string;
  };
}) => {
  const id = params.watchlistID;
  if (id === "new") return null;
  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">Recommended Tasks</h2>
      <div className="space-y-4 mb-4">
        <RecommendedTaskProvider>
          <Recommendedtask id={id} />
        </RecommendedTaskProvider>
      </div>
    </div>
  );
};

export default recommendedPage;
