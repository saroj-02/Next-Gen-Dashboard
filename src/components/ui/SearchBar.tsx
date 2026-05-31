"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { useSearch } from "@/lib/SearchContext";

export default function SearchBar() {
  const { query, setQuery } = useSearch();
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex-1 max-w-sm">
      <label htmlFor="dashboard-search" className="sr-only">
        Search courses and content
      </label>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: focused ? "var(--accent-primary)" : "var(--text-muted)", transition: "color 0.2s" }}
        />
        <input
          id="dashboard-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses, topics..."
          className="w-full rounded-xl pl-9 pr-8 py-2 text-sm outline-none transition-all"
          style={{
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: focused ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
            boxShadow: focused ? "0 0 0 2px rgba(108,99,255,0.15)" : "none",
            caretColor: "var(--accent-primary)",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
            aria-label="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
