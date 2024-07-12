// "use client";
// import { Button } from "@/components/ui/button";
// import { LucideEdit, Check, X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Task, Watchlist } from "@/lib/types";
// import Link from "next/link";
// import { deleteTask, updateTask } from "@/lib/actions/tasks";

// const WatchlistItem = ({ data }: { data: Watchlist }) => {
//   const router = useRouter();

//   function editWatchlist() {
//     router.push(`watchlist/${data.id}`);
//   }
//   async function approveTask({ item }: { item: Task }) {
//     const updatedTask = item;
//     updatedTask.approved = true;
//     const taskID = item.id;
//     await updateTask({ newTask: updatedTask, taskID });
//   }
//   async function rejectTask(id: string) {
//     await deleteTask({ id });
//   }
//   return (
//     <div className=" group/watchlistItem flex flex-col space-y-2 justify-center px-6 py-4 border rounded-md hover:shadow-md">
//       <div className=" flex justify-between items-center">
//         <h1 className=" text-3xl font-semibold">{data.title}</h1>
//         <Button
//           onClick={editWatchlist}
//           variant={"ghost"}
//           className="  invisible  group-hover/watchlistItem:visible transition-all"
//         >
//           <LucideEdit className="w-6 h-6" />
//         </Button>
//       </div>
//       <div className="flex flex-wrap  gap-2">
//         {data.keywords.map((item) => (
//           <span
//             key={item.id}
//             className={`px-2 py-1 rounded-full mr-2 mb-2 shadow flex items-center capitalize ${
//               item.approve === false
//                 ? "bg-orange-100 text-orange-700"
//                 : "bg-blue-100 text-blue-700"
//             }`}
//           >
//             {item.keyword}
//           </span>
//         ))}
//       </div>
//       <div className="flex flex-col gap-3">
//         {data.tasks?.map((item) => {
//           if (item.approved === false)
//             return (
//               <div key={item.id} className="group/pending flex items-center">
//                 <Link
//                   href={`/watchlist/${data.id}`}
//                   className="text-lg font-medium px-2 py-1 cursor-pointer hover:bg-gray-200 rounded-md"
//                 >
//                   {item.title}
//                 </Link>
//                 <div
//                   onClick={() => approveTask({ item })}
//                   className="p-2 border rounded-md  ml-6 mr-2 invisible group-hover/pending:visible cursor-pointer"
//                 >
//                   <Check className="w-2 h-2" />
//                 </div>
//                 <div
//                   onClick={() => rejectTask(item.id)}
//                   className="p-2 border rounded-md invisible group-hover/pending:visible  cursor-pointer "
//                 >
//                   <X className="w-2 h-2" />
//                 </div>
//               </div>
//             );
//         })}
//       </div>
//     </div>
//   );
// };

// export default WatchlistItem;

"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LucideEdit, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Task, Watchlist } from "@/lib/types";
import Link from "next/link";
import { deleteTask, updateTask } from "@/lib/actions/tasks";

const WatchlistItem = ({ data }: { data: Watchlist }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  function editWatchlist() {
    router.push(`watchlist/${data.id}`);
  }

  async function approveTask({ item }: { item: Task }) {
    const updatedTask = { ...item, approved: true };
    const taskID = item.id;
    await updateTask({ newTask: updatedTask, taskID });
  }

  async function rejectTask(id: string) {
    await deleteTask({ id });
  }

  const MAX_KEYWORDS = 5;

  return (
    <div className="group/watchlistItem flex flex-col space-y-2 justify-center px-6 py-4 border rounded-md hover:shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">{data.title}</h1>
        <Button
          onClick={editWatchlist}
          variant={"ghost"}
          className="invisible group-hover/watchlistItem:visible transition-all"
        >
          <LucideEdit className="w-6 h-6" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.keywords
          .slice(0, isExpanded ? data.keywords.length : MAX_KEYWORDS)
          .map((item) => (
            <span
              key={item.id}
              className={`px-2 py-1 rounded-full mr-2 mb-2 shadow flex items-center capitalize ${
                item.approve === false
                  ? "bg-orange-100 text-orange-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {item.keyword}
            </span>
          ))}
      </div>
      {data.keywords.length > MAX_KEYWORDS && (
        <Button
          className="items-start justify-start"
          variant="link"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "View Less" : "View More"}
        </Button>
      )}
      <div className="flex flex-col gap-3">
        {data.tasks?.map((item) => {
          if (item.approved === false)
            return (
              <div key={item.id} className="group/pending flex items-center">
                <Link
                  href={`/watchlist/${data.id}`}
                  className="text-lg font-medium px-2 py-1 cursor-pointer hover:bg-gray-200 rounded-md"
                >
                  {item.title}
                </Link>
                <div
                  onClick={() => approveTask({ item })}
                  className="p-2 border rounded-md ml-6 mr-2 invisible group-hover/pending:visible cursor-pointer"
                >
                  <Check className="w-2 h-2" />
                </div>
                <div
                  onClick={() => rejectTask(item.id)}
                  className="p-2 border rounded-md invisible group-hover/pending:visible cursor-pointer"
                >
                  <X className="w-2 h-2" />
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default WatchlistItem;
