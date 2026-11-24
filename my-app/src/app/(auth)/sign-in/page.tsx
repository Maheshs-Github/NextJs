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
import { signInSchema } from "@/src/schemas/signInSchema";
import { signIn } from "next-auth/react";

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { identifier: "", password: "" },
  });


  const onSubmit = async (data: SignInForm) => {
    try {
      const result = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });
      if(result?.error){
        if(result.error === "CredentialsSignin") {
          toast.add({
            title: "Sign-in failed",
            description: "Invalid email or password.",
          });
        } else {
          toast.add({
            title: "Sign-in failed",
            description: result.error,
          });
        }
      } else {
        toast.add({
          title: "Sign-in successful",
          description: "You have successfully signed in.",
        });
      }
      if(result?.url){
        router.replace(result.url);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
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
            <label htmlFor="email" className="text-sm font-medium text-gray-800">Email</label>
            <input id="email" type="email" autoComplete="email" {...register("identifier")} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-950 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10" />
            {errors.identifier && <p className="text-sm text-red-600">{errors.identifier.message}</p>}
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
