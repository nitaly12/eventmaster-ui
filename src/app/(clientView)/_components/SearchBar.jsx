"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl flex-col gap-3 px-4 sm:flex-row sm:items-center"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events..."
        className="h-12 flex-1 rounded-full border border-[#D0D5DD] px-5 text-[15px] text-[#1D2939] outline-none focus:border-[#7939EF] focus:ring-2 focus:ring-[#7939EF]/20"
        aria-label="Search events"
      />
      <button
        type="submit"
        className="h-12 shrink-0 rounded-full bg-[#7939EF] px-8 text-[15px] font-semibold text-white transition-colors hover:bg-[#6930d4]"
      >
        Search
      </button>
    </form>
  );
}
