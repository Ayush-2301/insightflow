import ApprovedTask from "../../components/ApprovedTask";

const approvedTaskpage = async ({
  params,
}: {
  params: {
    watchlistID: string;
  };
}) => {
  const id = params.watchlistID;
  if (id === "new") return null;

  return <ApprovedTask watchlistID={id} />;
};

export default approvedTaskpage;
