"use client";

import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { signUpSchema } from "@/src/schemas/signupSchema";
import type { ApiResponse } from "@/src/types/ApiResponse";
import type { z } from "zod";
import { Loader2 } from "lucide-react";

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [debouncedUsername, setDebouncedUsername] = useDebounceValue("", 500);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const username = useWatch({ control, name: "username" });

  useEffect(() => {
    setDebouncedUsername(username);
  }, [username, setDebouncedUsername]);

  useEffect(() => {
    if (!debouncedUsername || errors.username) {
      setUsernameMessage("");
      setIsUsernameAvailable(null);
      setIsCheckingUsername(false);
      return;
    }

    let cancelled = false;
    const checkUsername = async () => {
      setIsCheckingUsername(true);
      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${encodeURIComponent(debouncedUsername)}`
        );
        if (!cancelled) {
          setUsernameMessage(response.data.message);
          setIsUsernameAvailable(response.data.success);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (!cancelled) {
          setUsernameMessage(axiosError.response?.data.message ?? "Unable to check username");
          setIsUsernameAvailable(false);
        }
      } finally {
        if (!cancelled) setIsCheckingUsername(false);
      }
    };

    void checkUsername();
    return () => {
      cancelled = true;
    };
  }, [debouncedUsername, errors.username]);

  const onSubmit = async (data: SignUpForm) => {
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.add({
        title: "Account created",
        description: response.data.message,
        type: "success",
      });
      router.push(`/verify/${encodeURIComponent(data.username)}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Sign up failed",
        description: axiosError.response?.data.message ?? "Please try again.",
        type: "error",
      });
    }
  };

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-gray-100 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold tracking-tight text-gray-950">
          Mystery Message
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-200/60 sm:p-8"
          noValidate
        >
          <div>
            <h2 className="text-2xl font-semibold text-gray-950">Create your account</h2>
            <p className="mt-1 text-sm text-gray-600">Sign up to get started.</p>
          </div>

          <div className="space-y-1">
            <label htmlFor="username" className="text-sm font-medium text-gray-800">Username</label>
            <input id="username" autoComplete="username" {...register("username")} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-950 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10" />
            {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
            {!errors.username && username && (
              <p
                className={`min-h-5 text-sm ${
                  isCheckingUsername
                    ? "text-gray-600"
                    : isUsernameAvailable
                      ? "text-green-600"
                      : "text-red-600"
                }`}
              >
                {isCheckingUsername ? "Checking username…" : usernameMessage}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-800">Email</label>
            <input id="email" type="email" autoComplete="email" {...register("email")} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-950 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10" />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-800">Password</label>
            <input id="password" type="password" autoComplete="new-password" {...register("password")} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-950 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10" />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-gray-950 px-4 py-2.5 font-medium text-white transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create account"
            )}
          </button>
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/sign-in" className="font-medium text-blue-600 hover:underline">
              Sign in
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
