"use client";

import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { Input } from "./input";
import { useUrlFilters } from "@/hooks/use-url-filters";

export function SearchInput({ placeholder }: { placeholder: string }) {
  const { setFilter, getFilter } = useUrlFilters();

  const handleSearch = useDebouncedCallback((term: string) => {
    setFilter("search", term);
  }, 350);

  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-9"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={getFilter("search")?.toString()}
      />
    </div>
  );
}
