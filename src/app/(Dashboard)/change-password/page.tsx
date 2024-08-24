"use client";

import { useForm } from "react-hook-form";
import { ChangePasswordForm, changePasswordSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createElement, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { readUser } from "@/lib/actions";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from "@/components/ui/box";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);
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
      setUserLoading(true);
      const user = await readUser();
      if (user.data.user?.email) setUserEmail(user.data.user?.email);
      setUserLoading(false);
    }
    getUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col space-y-2">
        <h2 className=" text-3xl font-medium">Reset account Password</h2>
        <div className=" text-muted-foreground text-center  flex items-center justify-center space-x-1">
          <span>Enter a new password for</span>
          {userLoading ? (
            <Skeleton className="w-[150px] h-[30px] " />
          ) : (
            <span>{userEmail}</span>
          )}
        </div>
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
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Box className="relative">
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder="New Password"
                      type={passwordVisibility ? "text" : "password"}
                    />
                    <Box
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
                      onClick={() => setPasswordVisibility(!passwordVisibility)}
                    >
                      {createElement(
                        passwordVisibility ? EyeOffIcon : EyeIcon,
                        {
                          className: "h-6 w-6",
                        }
                      )}
                    </Box>
                  </Box>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Box className="relative">
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder="Confirm New Password"
                      type={confirmPasswordVisibility ? "text" : "password"}
                    />
                    <Box
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
                      onClick={() =>
                        setConfirmPasswordVisibility(!confirmPasswordVisibility)
                      }
                    >
                      {createElement(
                        confirmPasswordVisibility ? EyeOffIcon : EyeIcon,
                        {
                          className: "h-6 w-6",
                        }
                      )}
                    </Box>
                  </Box>
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
