"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { verifySchema } from "@/src/schemas/verifySchema";
import type { ApiResponse } from "@/src/types/ApiResponse";

type VerifyForm = z.infer<typeof verifySchema>;

export default function VerifyAccountForm({ username }: { username: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: { username, code: "" },
  });

  const onSubmit = async (data: VerifyForm) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username,
        code: data.code,
      });
      toast.add({
        title: "Account verified",
        description: response.data.message,
        type: "success",
      });
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Verification failed",
        description: axiosError.response?.data.message ?? "Please check your OTP and try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-gray-100 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold tracking-tight text-black">
          Mystery Message
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-5 rounded-2xl border border-gray-200 bg-white p-6 text-black shadow-lg shadow-gray-200/60 sm:p-8"
          noValidate
        >
          <div>
            <h2 className="text-2xl font-semibold text-black">Verify Account</h2>
            <p className="mt-1 text-sm text-black">Enter Your OTP</p>
          </div>

          <div className="space-y-1">
            <label htmlFor="code" className="text-sm font-medium text-black">OTP</label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              autoFocus
              {...register("code")}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
            {errors.code && <p className="text-sm text-red-600">{errors.code.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-2.5 font-medium text-white transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</>
            ) : "Verify Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
