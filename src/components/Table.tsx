// "use client";
// import { RecommendedTask } from "@/lib/types";
// import { columns } from "@/components/recommendedTask/columns";
// import { DataTable } from "./recommendedTask/data-table";
// import React, { useEffect, useState } from "react";
// import { GroupProp } from "@/app/(Dashboard)/watchlist/components/RecommendationTaskTable";
// import { Input } from "./ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "./ui/button";

// const Table = ({
//   recommendedTask,
//   group,
// }: {
//   recommendedTask: RecommendedTask[];
//   group: GroupProp;
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "reset">("reset");
//   const [selectValue, setSelectValue] = useState<"asc" | "desc" | "reset">(
//     "reset"
//   );
//   const [filteredTasks, setFilteredTasks] =
//     useState<RecommendedTask[]>(recommendedTask);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleSortChange = (value: "asc" | "desc" | "reset") => {
//     setSortOrder(value);
//     setSelectValue(value); // Update the select value
//   };

//   const handleReset = () => {
//     setSearchTerm("");
//     setSortOrder("reset");
//     setSelectValue("reset");
//     setFilteredTasks(recommendedTask);
//   };

//   useEffect(() => {
//     const sortedTasks = [...recommendedTask].sort((a, b) =>
//       sortOrder === "asc" ? a.clarity - b.clarity : b.clarity - a.clarity
//     );
//     const filtered = sortedTasks.filter((task) =>
//       task.task.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredTasks(filtered);
//   }, [sortOrder, searchTerm, recommendedTask]);

//   const highlightText = (text: string, highlight: string) => {
//     if (!highlight.trim()) {
//       return text;
//     }
//     const regex = new RegExp(`(${highlight})`, "gi");
//     return text.split(regex).map((part, index) =>
//       regex.test(part) ? (
//         <span key={index} className="bg-purple-300">
//           {part}
//         </span>
//       ) : (
//         part
//       )
//     );
//   };

//   return (
//     <div>
//       <div className="flex gap-2 items-center mb-4">
//         <Input
//           value={searchTerm}
//           onChange={handleSearchChange}
//           placeholder="Search Recommended Tasks"
//         />
//         <Select value={selectValue} onValueChange={handleSortChange}>
//           <SelectTrigger className="w-fit">
//             <SelectValue placeholder="Sort by Clarity" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectLabel>Sort by Clarity</SelectLabel>
//               <SelectItem value="reset">Sort by Clarity</SelectItem>
//               <SelectItem value="desc">Highest to Lowest Clarity</SelectItem>
//               <SelectItem value="asc">Lowest to Highest Clarity</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//         <Button onClick={handleReset}>Reset</Button>
//       </div>
//       <DataTable columns={columns} data={filteredTasks} />
//     </div>
//   );
// };

// export default Table;

"use client";
import { RecommendedTask } from "@/lib/types";
import { columns } from "@/components/recommendedTask/columns";
import { DataTable } from "./recommendedTask/data-table";
import React, { useContext, useEffect, useState } from "react";
import { GroupProp } from "@/app/(Dashboard)/watchlist/components/RecommendationTaskTable";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Context } from "./provider/ContextProvider";

const Table = ({ group }: { group: GroupProp }) => {
  const { recommendedTask } = useContext(Context);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "reset">("reset");
  const [selectValue, setSelectValue] = useState<"asc" | "desc" | "reset">(
    "reset"
  );
  const [filteredTasks, setFilteredTasks] =
    useState<RecommendedTask[]>(recommendedTask);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (value: "asc" | "desc" | "reset") => {
    setSortOrder(value);
    setSelectValue(value); // Update the select value
  };

  const handleReset = () => {
    setSearchTerm("");
    setSortOrder("reset");
    setSelectValue("reset");
    setFilteredTasks(recommendedTask);
  };

  useEffect(() => {
    let sortedTasks = [...recommendedTask];

    if (sortOrder !== "reset") {
      sortedTasks.sort((a, b) =>
        sortOrder === "asc" ? a.clarity - b.clarity : b.clarity - a.clarity
      );
    }

    const filtered = sortedTasks.filter((task) =>
      task.task.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [sortOrder, searchTerm, recommendedTask]);

  return (
    <div>
      <div className="flex gap-2 items-center mb-4">
        <Input
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search Recommended Tasks"
        />
        {/* <Select value={selectValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Sort by Clarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="reset">Sort by Clarity</SelectItem>
              <SelectItem value="desc">Highest to Lowest Clarity</SelectItem>
              <SelectItem value="asc">Lowest to Highest Clarity</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> */}
        <Button>Search</Button>
      </div>
      <DataTable columns={columns} data={filteredTasks} />
    </div>
  );
};

export default Table;
