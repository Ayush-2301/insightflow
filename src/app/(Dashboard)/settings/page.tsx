import { Suspense } from "react";
import ProfileServer from "./components/ProfileServer";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

const page = () => {
  return (
    <div className="space-y-6 max-w-[80%]">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how your profile information looks like.
        </p>
      </div>
      <Separator />
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileServer />
      </Suspense>
    </div>
  );
};

export default page;

export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col  space-y-6">
      <div className="flex flex-col space-y-2">
        <Label className=" text-lg">Username</Label>
        <Skeleton className="h-[30px] w-[150px] rounded-md" />
      </div>
      <div className="flex flex-col space-y-2">
        <Label className=" text-lg">Email</Label>
        <Skeleton className="h-[30px] w-[200px] rounded-sm" />
      </div>
    </div>
  );
};
