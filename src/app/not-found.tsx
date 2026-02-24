"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

function NotFoundActions() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      <Button asChild variant="default">
        <Link href="/">Go home</Link>
      </Button>
      <Button variant="outline" onClick={handleGoBack}>
        Go back
      </Button>
    </div>
  );
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <main className="mx-auto max-w-md text-center">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
          404
        </h1>
        <p className="mt-2 text-foreground">
          This page isn’t here. Maybe it moved or the link is outdated.
        </p>
        <blockquote className="mt-8 text-muted-foreground">
          <p className="text-sm font-normal italic sm:text-base">
            “There are no mistakes, just happy accidents”
          </p>
          <cite className="mt-1 block text-xs not-italic">
            — Bob Ross
          </cite>
        </blockquote>
        <NotFoundActions />
      </main>
    </div>
  );
}
