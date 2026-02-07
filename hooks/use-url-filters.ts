"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useUrlFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const setFilter = useCallback((key: string, value: string | null | undefined) => {
        const params = new URLSearchParams(searchParams.toString());

        // Always reset page to 1 when a filter changes
        params.delete("page");

        if (value && value !== "" && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const removeFilter = useCallback((key: string) => {
        const params = new URLSearchParams(searchParams.toString());

        // Always reset page to 1 when a filter is removed
        params.delete("page");
        params.delete(key);

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const resetFilters = useCallback(() => {
        router.replace(pathname, { scroll: false });
    }, [pathname, router]);

    const getFilter = useCallback((key: string) => {
        return searchParams.get(key);
    }, [searchParams]);

    return {
        setFilter,
        removeFilter,
        resetFilters,
        getFilter,
        searchParams
    };
}
