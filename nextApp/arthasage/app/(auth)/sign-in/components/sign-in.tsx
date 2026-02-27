"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

const signInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/user";
  const [loading, setLoading] = useState({
    method: "",
    isLoading: false,
  });

  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
    } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
        email: "",
        password: "",
    },
  });

  const email = watch("email");

  const signIn = async (formData: SignInFormData) => {
    setLoading({
      method: "password",
      isLoading: true,
    });
    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: redirectUrl,
      });
      if (error) {
        toast.error(error.message || "Failed to sign in");
        setLoading({ method: "", isLoading: false });
        return;
      }
      toast.success("Successfully signed in!");
      router.replace(redirectUrl);
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred");
      setLoading({ method: "", isLoading: false });
    }
  };

  const goToSignUp = async () => {
    router.push("/sign-up");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
          <CardAction>
            <Link href="/sign-up">
              <Button variant="link" className="px-0">
                Create an account
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(signIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                disabled={loading.isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                disabled={loading.isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading.isLoading}
            >
              {loading.method === "password" ? (
                <>
                  <Spinner className="mr-2" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

    </div>
  );
}
