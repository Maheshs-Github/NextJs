import Link from "next/link";
import { ArrowRight, Heart, LockKeyhole, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const sampleMessages = [
  {
    message: "You make even the most ordinary days feel a little brighter. ☀️",
    label: "A little sunshine",
    color: "bg-amber-100 text-amber-800",
    icon: "☀️",
  },
  {
    message: "I’ve always admired how you show up for the people you care about.",
    label: "Someone noticed",
    color: "bg-rose-100 text-rose-800",
    icon: "💌",
  },
  {
    message: "We should bring back our spontaneous coffee runs. Your pick this time! ☕",
    label: "A friendly nudge",
    color: "bg-sky-100 text-sky-800",
    icon: "☕",
  },
  {
    message: "Plot twist: you’re doing better than you think. Keep going. ✨",
    label: "A reminder for you",
    color: "bg-violet-100 text-violet-800",
    icon: "✨",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <section className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3.5 py-2 text-sm font-medium text-violet-800 shadow-sm">
              <Sparkles className="h-4 w-4" /> A little mystery, a lot of kindness
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl lg:leading-[1.08]">
              The things people think, <span className="text-violet-700">but don’t always say.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
              Get thoughtful, funny, and completely anonymous messages from the people around you. Share your link and see what’s on their minds.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button render={<Link href="/sign-up" />} className="h-11 gap-2 rounded-xl bg-violet-700 px-5 text-white hover:bg-violet-800">
                Get your free link <ArrowRight className="h-4 w-4" />
              </Button>
              <Button render={<Link href="/sign-in" />} variant="outline" className="h-11 rounded-xl border-gray-300 bg-white px-5">
                I already have an account
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-violet-600" /> No names attached</span>
              <span className="inline-flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" /> Made for good vibes</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg px-8 sm:px-12 lg:px-8">
            <div className="absolute -left-2 top-8 h-28 w-28 rounded-full bg-violet-200/70 blur-3xl" />
            <div className="absolute -right-2 bottom-8 h-32 w-32 rounded-full bg-rose-200/70 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white bg-white/80 p-5 shadow-xl shadow-violet-900/5 backdrop-blur sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-950">Notes from your people</p>
                  <p className="mt-1 text-xs text-gray-500">A few things you might hear…</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700"><MessageCircle className="h-5 w-5" /></div>
              </div>

              <Carousel opts={{ loop: true }} aria-label="Example anonymous messages">
                <CarouselContent className="-ml-3">
                  {sampleMessages.map((item) => (
                    <CarouselItem key={item.label} className="basis-full pl-3">
                      <Card className="min-h-56 rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <CardHeader className="pb-2">
                          <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${item.color}`}>{item.icon} {item.label}</span>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-xl font-medium leading-8 tracking-tight text-gray-800">“{item.message}”</p>
                        </CardContent>
                        <CardFooter className="mt-auto justify-between border-t-0 bg-transparent pt-3 text-xs text-gray-400">
                          <span>Anonymous, of course</span><span className="flex gap-1" aria-label="Five stars">★★★★★</span>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-10 border-gray-200 bg-white sm:-left-12" />
                <CarouselNext className="-right-10 border-gray-200 bg-white sm:-right-12" />
              </Carousel>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400"><span className="h-1.5 w-1.5 rounded-full bg-violet-500" />Swipe or use the arrows to read more</div>
            </div>
            <div className="absolute -bottom-5 -left-2 hidden items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-700 shadow-lg sm:flex"><span className="text-lg">💜</span> A little kindness goes a long way</div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white/80 px-4 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Mystery Message. All rights reserved.
      </footer>
    </div>
  );
}
