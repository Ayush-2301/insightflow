import Recommendedtask from "../../components/Recommendedtask";

async function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const recommendedPage = async ({
  params,
}: {
  params: {
    watchlistID: string;
  };
}) => {
  const id = params.watchlistID;
  if (id === "new") return null;
  await pause(3000);
  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">Recommended Tasks</h2>
      <div className="space-y-4 mb-4">
        <Recommendedtask />
      </div>
    </div>
  );
};

export default recommendedPage;
