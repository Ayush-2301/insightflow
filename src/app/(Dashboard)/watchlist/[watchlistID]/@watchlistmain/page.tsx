// import { getWatchlist } from "@/lib/actions/watchlist";
// import { Keyword, Watchlist } from "@/lib/types";
// import WatchlistForm from "../../components/WatchlistForm";
// import { getMasterKeywords, readUser } from "@/lib/actions";

// const watchlistMain = async ({
//   params,
// }: {
//   params: { watchlistID: string };
// }) => {
//   const id = params.watchlistID;
//   const { data } = await readUser();
//   const userID = data.user?.id;
//   const initialData: Watchlist | undefined =
//     id === "new" ? undefined : await getWatchlist({ id });

//   let suggestedKeywords: Keyword[] | undefined;
//   const res = await getMasterKeywords();

//   if (res) {
//     suggestedKeywords = res?.map((item) => {
//       return {
//         id: item.id,
//         keyword: item.keyword,
//         volume: "0",
//         approve: false,
//       };
//     });
//   }

//   return (
//     <div>
//       {userID && (
//         <WatchlistForm
//           userID={userID}
//           initialData={initialData}
//           initialsuggestedKeywords={suggestedKeywords}
//         />
//       )}
//     </div>
//   );
// };

// export default watchlistMain;

import { getWatchlist } from "@/lib/actions/watchlist";
import { Keyword } from "@/lib/types";
import WatchlistForm from "../../components/WatchlistForm";
import { getMasterKeywords, readUser } from "@/lib/actions";

const watchlistMain = async ({
  params,
}: {
  params: { watchlistID: string };
}) => {
  const id = params.watchlistID;

  const [userResponse, initialData, keywordResponse] = await Promise.all([
    readUser(),
    id === "new" ? undefined : getWatchlist({ id }),
    getMasterKeywords(),
  ]);

  const userID = userResponse.data.user?.id;

  const suggestedKeywords: Keyword[] | undefined = keywordResponse?.map(
    (item) => ({
      id: item.id,
      keyword: item.keyword,
      volume: "0",
      approve: false,
    })
  );

  return (
    <div>
      {userID && (
        <WatchlistForm
          userID={userID}
          initialData={initialData}
          initialsuggestedKeywords={suggestedKeywords}
        />
      )}
    </div>
  );
};

export default watchlistMain;
