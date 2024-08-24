"use client";

import { Profile } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { profileSchema, type ProfileForm } from "../schema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pencil, PencilLine } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { updateProfile } from "@/lib/actions/profile";
import { Spinner } from "@/components/Spinner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const ProfileForm = ({ initialData }: { initialData: Profile }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialData.username,
    },
  });
  async function onSubmit(value: ProfileForm) {
    setIsLoading(true);
    const res = await updateProfile({ username: value.username });
    if ("error" in res) {
      toast({
        title: "Error updating profile",
        description: res.error,
        variant: "destructive",
      });
      setIsLoading(false);
      setIsEdit(false);
    } else {
      toast({
        title: "Profile updated successfully",
      });
      setIsLoading(false);
      setIsEdit(false);
    }

    toast({
      title: "Profile updated successfully",
    });
    setIsLoading(false);
    setIsEdit(false);
  }
  const getURL = () => {
    let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/";

    url = url.startsWith("http") ? url : `https://${url}`;
    url = url.endsWith("/") ? url : `${url}/`;
    return url;
  };

  async function handleResetPassword() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.resetPasswordForEmail(initialData.email, {
      redirectTo: `${getURL()}/change-password`,
    });
  }

  return (
    <div className="flex flex-col space-y-6">
      {!isEdit ? (
        <div className="flex flex-col space-y-2">
          <Label className=" text-lg">Username</Label>
          <div className="flex gap-2 items-center group/pencil px-1 py-2 hover:bg-gray-100 rounded-md w-fit transition-all ease-in-out ">
            <p className=" text-muted-foreground ">{initialData.username}</p>
            <PencilLine
              onClick={() => setIsEdit(true)}
              className="w-4 h-4 group-hover/pencil:block hidden cursor-pointer transition-all ease-in-out"
            />
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="User name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 mt-2">
              <Button disabled={isLoading} type="submit">
                {isLoading ? <Spinner /> : <>Save</>}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
      <div className="flex flex-col space-y-2">
        <Label className=" text-lg">Email</Label>
        <p className=" text-muted-foreground ">{initialData.email}</p>
      </div>
      <Button variant={"outline"} onClick={handleResetPassword}>
        Reset Password
      </Button>
    </div>
  );
};

export default ProfileForm;
