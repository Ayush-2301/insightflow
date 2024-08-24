"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { registerFormSchema } from "@/lib/schema";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { signUpWithEmailAndPassword } from "../actions";
import { Box } from "@/components/ui/box";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}
type FormData = z.infer<typeof registerFormSchema>;

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const router = useRouter();
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    React.useState(false);
  const { toast } = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerFormSchema),
  });

  async function onSubmit(data: FormData) {
    try {
      const res = await signUpWithEmailAndPassword(data);
      const user = await JSON.parse(res);
      reset();
      if (user.data.user) {
        router.push("/");
        router.refresh();
        toast({
          variant: "default",
          title: "Welcome!",
          description: "Signup Successful",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: user.error?.code,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (error) {
      reset();
    }
  }

  return (
    <div className={cn("grid gap-6 ", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-2">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                {...register("username", { required: true })}
                id="username"
                placeholder="John Doe"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isSubmitting}
              />
              {errors?.username && (
                <p className="text-red-600 text-sm">
                  {errors?.username?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email", { required: true })}
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isSubmitting}
              />
              {errors?.email && (
                <p className="text-red-600 text-sm">{errors?.email?.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">Password</Label>
              <Box className="relative">
                <Input
                  {...register("password", { required: true })}
                  id="password"
                  placeholder="Password"
                  type={passwordVisibility ? "text" : "password"}
                  disabled={isSubmitting}
                />
                <Box
                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
                  onClick={() => setPasswordVisibility(!passwordVisibility)}
                >
                  {React.createElement(
                    passwordVisibility ? EyeOffIcon : EyeIcon,
                    {
                      className: "h-5 w-5",
                    }
                  )}
                </Box>
              </Box>
              {errors?.password && (
                <p className="text-red-600 text-sm">
                  {errors?.password?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Box className="relative">
                <Input
                  {...register("confirmPassword", { required: true })}
                  id="confirmPassword"
                  placeholder="Re-write password"
                  type={confirmPasswordVisibility ? "text" : "password"}
                  disabled={isSubmitting}
                />
                <Box
                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
                  onClick={() =>
                    setConfirmPasswordVisibility(!confirmPasswordVisibility)
                  }
                >
                  {React.createElement(
                    confirmPasswordVisibility ? EyeOffIcon : EyeIcon,
                    {
                      className: "h-5 w-5",
                    }
                  )}
                </Box>
              </Box>
              {errors?.confirmPassword && (
                <p className="text-red-600 text-sm">
                  {errors?.confirmPassword?.message}
                </p>
              )}
            </div>
          </div>
          <Button className="mt-3" disabled={isSubmitting}>
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
}
