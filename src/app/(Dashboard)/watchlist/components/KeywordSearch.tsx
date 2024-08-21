"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { Keyword } from "@/lib/types";
import { debounce } from "@/lib/utils";
import { searchKeyword } from "@/lib/actions";
import { Spinner } from "@/components/Spinner";
import { Skeleton } from "@/components/ui/skeleton";

interface KeywordSearchProps {
  loadingSuggestions: boolean;
  onSelect: (keyword: Keyword) => void;
  selectedKeywords: Keyword[];
  suggestedKeywords: Keyword[] | undefined;
  isLoading: boolean;
}

const KeywordSearch: React.FC<KeywordSearchProps> = ({
  loadingSuggestions,
  onSelect,
  selectedKeywords,
  suggestedKeywords,
  isLoading,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Keyword[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [fetchingKeywords, setFetchingKeywords] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchKeywords = async (searchString: string) => {
    setFetchingKeywords(true);
    try {
      const response = await searchKeyword({ searchString });
      if (response) {
        setSuggestions(response);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching keywords:", error);
      setSuggestions([]);
    } finally {
      setFetchingKeywords(false);
    }
  };

  useEffect(() => {
    setSuggestions((prev) =>
      prev.filter(
        (keyword: Keyword) =>
          !selectedKeywords.some((selected) => selected.id === keyword.id)
      )
    );
  }, [selectedKeywords, setSuggestions]);

  const debouncedFetchKeywords = useCallback(
    debounce((value: string) => {
      fetchKeywords(value);
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchKeywords(value);
  };

  const handleSelect = (keyword: Keyword) => {
    if (
      !isLoading &&
      !selectedKeywords.some((selected) => selected.id === keyword.id)
    ) {
      onSelect(keyword);
    }
    setQuery("");
    setSuggestions([]);
  };

  const handleAddCustomKeyword = () => {
    const customKeyword: Keyword = {
      id: uuid(),
      keyword: query,
      volume: "0",
      approve: false,
    };
    if (customKeyword.keyword !== "") onSelect(customKeyword);
    setQuery("");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  const filteredSuggestions =
    suggestions.length > 0
      ? suggestions.filter(
          (keyword: Keyword) =>
            !selectedKeywords.some((selected) => selected.id === keyword.id)
        )
      : [];

  const displayedKeywords = showMore
    ? suggestedKeywords
    : suggestedKeywords?.slice(0, 10);

  return (
    <div className="relative w-full rounded-md" ref={containerRef}>
      <div className="flex space-x-2">
        <input
          type="text"
          value={query}
          disabled={isLoading}
          onChange={handleInputChange}
          placeholder="Search keywords"
          className="w-full border p-2 rounded-md"
        />
        <Button
          disabled={isLoading}
          className=" border"
          type="button"
          onClick={handleAddCustomKeyword}
        >
          Add
        </Button>
      </div>
      {fetchingKeywords && (
        <div className="absolute left-0 right-0 bg-white border mt-1 z-10 max-h-60 overflow-y-auto flex justify-center items-center py-4">
          <Spinner size={"lg"} />
        </div>
      )}
      {filteredSuggestions.length > 0 && !fetchingKeywords && (
        <ul className="absolute left-0 right-0 bg-white border mt-1 z-10 max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {suggestion.keyword}
            </li>
          ))}
        </ul>
      )}
      {!fetchingKeywords && query && filteredSuggestions.length === 0 && (
        <Button
          type="button"
          disabled={isLoading}
          onClick={handleAddCustomKeyword}
          variant={"outline"}
          className="mt-3"
        >
          Add &quot;{query}&quot; as custom keyword
        </Button>
      )}
      {loadingSuggestions ? (
        <SuggestedKeywordsSkeleton />
      ) : (
        <>
          {suggestedKeywords && (
            <div className="mt-4">
              <p className="text-lg font-semibold mb-1">Suggested Keywords:</p>
              <div className="flex flex-wrap gap-2 transition-all duration-500">
                {displayedKeywords?.map((keyword) => (
                  <span
                    key={keyword.id}
                    onClick={() => handleSelect(keyword)}
                    className={`px-2 py-1 rounded-full cursor-pointer capitalize ${
                      selectedKeywords.some(
                        (selected) => selected.id === keyword.id
                      )
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    style={{ display: "inline-block" }}
                  >
                    {keyword.keyword}
                  </span>
                ))}
              </div>
              {suggestedKeywords.length > 10 && (
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={toggleShowMore}
                  variant={"outline"}
                  className="mt-3 text-blue-500 hover:underline focus:outline-none"
                >
                  {showMore ? "View Less" : "View More"}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KeywordSearch;

const getRandomWidth = () => {
  const min = 120;
  const max = 200;
  return `${Math.floor(Math.random() * (max - min + 1)) + min}px`;
};

const SuggestedKeywordsSkeleton = () => {
  return (
    <div className="mt-8 flex flex-wrap gap-3 w-full">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
        <Skeleton
          key={index}
          className="h-[35px] rounded-full"
          style={{ width: getRandomWidth() }}
        />
      ))}
    </div>
  );
};
