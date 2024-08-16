import { Skeleton } from "./ui/skeleton";

const HeadingSkeleton = () => {
  return (
    <div className="flex flex-col space-y-2">
      <Skeleton className="h-[50px] w-[400px] rounded-lg" />
      <Skeleton className="h-[30px] w-[300px] rounded-md" />
    </div>
  );
};

export default HeadingSkeleton;
