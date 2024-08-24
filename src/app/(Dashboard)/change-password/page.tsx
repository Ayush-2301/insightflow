"use client";

import { useForm } from "react-hook-form";
import { ChangePasswordForm, changePasswordSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { readUser } from "@/lib/actions";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/Spinner";

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  const { toast } = useToast();
  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(value: ChangePasswordForm) {
    setIsLoading(true);
    const supabase = createSupabaseBrowserClient();
    const res = await supabase.auth.updateUser({ password: value.newPassword });
    if (res) {
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      await supabase.auth.signOut();
      setIsLoading(false);
      toast({
        title: "Logged out",
        description: "You have been logged out. Please log in again.",
      });
      router.push("/auth");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    async function getUser() {
      const user = await readUser();
      if (user.data.user?.email) setUserEmail(user.data.user?.email);
    }
    getUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col space-y-2">
        <h2 className=" text-3xl">Reset account Password</h2>
        <p className=" text-muted-foreground">
          Enter a new password for {userEmail}
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" max-w-xl w-full space-y-4 mt-8"
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    {...field}
                    placeholder="New Password"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    {...field}
                    placeholder="Confirm New Password"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">
            {!isLoading ? "Reset Password" : <Spinner />}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChangePassword;
