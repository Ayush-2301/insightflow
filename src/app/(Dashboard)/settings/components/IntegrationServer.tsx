import { getTrelloInfo } from "@/lib/actions/trello";
import IntegrationForm from "./IntegrationForm";

const IntegerationServer = async () => {
  const trello_info = await getTrelloInfo();
  if (trello_info && "error" in trello_info) {
    return <p>Failed To Load your Trello Information</p>;
  }
  return (
    <div>
      <IntegrationForm
        access_token={trello_info?.access_token}
        board_id={trello_info?.board_id}
        boardTitle={trello_info?.boardTitle}
      />
    </div>
  );
};
export default IntegerationServer;
