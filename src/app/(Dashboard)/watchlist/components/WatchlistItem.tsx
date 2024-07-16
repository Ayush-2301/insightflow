"use client";
import React, { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { LucideEdit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Watchlist } from "@/lib/types";
const WatchlistItem = ({
  data,
  children,
}: {
  data: Watchlist;
  children: ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [show, setShow] = useState(false);
  const router = useRouter();

  function editWatchlist() {
    router.push(`watchlist/${data.id}`);
  }
  const MAX_KEYWORDS = 5;

  return (
    <div className="group/watchlistItem flex flex-col space-y-2 justify-center px-6 py-4 border rounded-md hover:shadow-md transition-all ease-in-out">
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
          className="items-start justify-start underline"
          variant="link"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "View Less" : "View More"}
        </Button>
      )}
      <Button
        variant={"ghost"}
        className="underline self-start text-start px-1"
        onClick={() => setShow(!show)}
      >
        {!show ? "Show Recommended Task" : "Close"}
      </Button>
      {show && <>{children}</>}
    </div>
  );
};

export default WatchlistItem;
