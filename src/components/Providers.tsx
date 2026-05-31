"use client";

import { NavProvider } from "@/lib/NavContext";
import { SearchProvider } from "@/lib/SearchContext";
import { UserProvider } from "@/lib/UserContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <NavProvider>
        <SearchProvider>
          {children}
        </SearchProvider>
      </NavProvider>
    </UserProvider>
  );
}
