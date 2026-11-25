"use client";

import MessageCard from "@/components/MessageCard";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { ApiResponse } from "@/src/types/ApiResponse";
import type { Message } from "@/src/models/user";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Link2, Mail, MessageCircle, RefreshCw, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const username = session?.user?.username;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(true);
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [isUpdatingSwitch, setIsUpdatingSwitch] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  const fetchMessages = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages ?? []);
      if (refresh) {
        toast.add({ title: "Messages refreshed", description: "You’re all caught up.", type: "success" });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({ title: axiosError.response?.data?.message ?? "Could not load messages", type: "error" });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse & { isAcceptingMessage?: boolean }>("/api/accept-messages");
      setAcceptMessages(Boolean(response.data.isAcceptingMessage));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({ title: axiosError.response?.data?.message ?? "Could not load message settings", type: "error" });
    } finally {
      setIsSwitchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      void fetchMessages();
      void fetchAcceptMessages();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [status, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async (checked: boolean) => {
    setIsUpdatingSwitch(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", { isAcceptingMessage: checked });
      setAcceptMessages(checked);
      toast.add({ title: response.data.message ?? "Message settings updated", type: "success" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({ title: axiosError.response?.data?.message ?? "Could not update message settings", type: "error" });
    } finally {
      setIsUpdatingSwitch(false);
    }
  };

  const profileUrl = username && origin ? `${origin}/u/${username}` : username ? `/u/${username}` : "";

  const copyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(`${origin || window.location.origin}/u/${username}`);
      toast.add({ title: "Profile link copied", description: "Share it with anyone who has a message for you.", type: "success" });
    } catch {
      toast.add({ title: "Could not copy the profile link", type: "error" });
    }
  };

  const removeMessage = (messageId: string) => {
    setMessages((current) => current.filter((message) => String(message._id) !== messageId));
  };

  if (status === "loading") {
    return <main className="flex flex-1 items-center justify-center bg-gray-50 px-4"><Loader2 className="h-6 w-6 animate-spin text-gray-500" aria-label="Loading dashboard" /></main>;
  }

  if (status === "unauthenticated" || !session?.user) {
    return <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-16"><div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700"><Mail className="h-6 w-6" /></div><h1 className="text-2xl font-semibold text-gray-950">Your dashboard is waiting</h1><p className="mt-2 text-sm text-gray-600">Sign in to manage your profile and read your messages.</p><a href="/sign-in" className="mt-6 inline-flex rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800">Sign in</a></div></main>;
  }

  return (
    <main className="flex-1 bg-gray-50 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-700"><Sparkles className="h-4 w-4" /> Your private inbox</p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">User Dashboard</h1>
            <p className="mt-2 text-gray-600">A little mystery, delivered straight to you.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Messages received</p>
            <p className="mt-1 text-2xl font-semibold text-gray-950">{messages.length}</p>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="profile-link-heading">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Link2 className="h-5 w-5" /></div>
              <div><h2 id="profile-link-heading" className="font-semibold text-gray-950">Your profile link</h2><p className="mt-1 text-sm text-gray-600">Share this link so people can send you anonymous messages.</p></div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row lg:max-w-xl">
              <div className="min-w-0 flex-1 truncate rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700" title={profileUrl}>{profileUrl || "Preparing your link…"}</div>
              <Button onClick={copyProfileUrl} disabled={!username} className="shrink-0 gap-2"><Link2 className="h-4 w-4" />Copy link</Button>
            </div>
          </div>
        </section>

        <section className="mb-10 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6" aria-labelledby="message-settings-heading">
          <div className="flex items-start gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${acceptMessages ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}><MessageCircle className="h-5 w-5" /></div>
            <div><h2 id="message-settings-heading" className="font-semibold text-gray-950">Accept messages</h2><p className="mt-1 text-sm text-gray-600">{acceptMessages ? "Your inbox is open. Let the surprises roll in!" : "Your inbox is closed. Turn this on whenever you’re ready."}</p></div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className={`text-sm font-medium ${acceptMessages ? "text-emerald-700" : "text-gray-500"}`}>{acceptMessages ? "On" : "Off"}</span>
            <Switch checked={acceptMessages} onCheckedChange={handleSwitchChange} disabled={isSwitchLoading || isUpdatingSwitch} aria-label="Accept messages" />
            {(isSwitchLoading || isUpdatingSwitch) && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          </div>
        </section>

        <section aria-labelledby="messages-heading">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div><h2 id="messages-heading" className="text-xl font-semibold text-gray-950">Your messages</h2><p className="mt-1 text-sm text-gray-600">Every note is a little surprise from someone out there.</p></div>
            <Button variant="outline" onClick={() => void fetchMessages(true)} disabled={isLoading || isRefreshing} className="shrink-0 gap-2"><RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />Refresh</Button>
          </div>

          {isLoading ? (
            <div className="flex min-h-44 items-center justify-center rounded-2xl border border-gray-200 bg-white"><Loader2 className="h-6 w-6 animate-spin text-gray-400" aria-label="Loading messages" /></div>
          ) : messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><Mail className="h-7 w-7" /></div>
              <h3 className="mt-4 text-lg font-semibold text-gray-950">Your inbox is a blank page</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">Share your profile link with friends, post it in your bio, or send it to the group chat. Your first mystery message could be just around the corner.</p>
              {acceptMessages && <Button onClick={copyProfileUrl} disabled={!username} className="mt-5 gap-2"><Link2 className="h-4 w-4" />Share your link</Button>}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">{messages.map((message) => <MessageCard key={String(message._id)} message={message} onMessageDelete={removeMessage} />)}</div>
          )}
        </section>
      </div>
    </main>
  );
}
