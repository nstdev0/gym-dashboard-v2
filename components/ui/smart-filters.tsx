"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "./button";
import { ArrowUpDown, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export interface FilterOption {
    label: string,
    value: string
}

export interface SortOption<T> {
    label: string;
    field: keyof T;
    value: string;
}

export interface SelectFilterConfig {
    key: string,
    label: string,
    options: FilterOption[]
}

export interface FilterConfiguration<T> {
    sort?: SortOption<T>[],
    filters?: SelectFilterConfig[]
}

interface FilterInputProps<T> {
    config: FilterConfiguration<T>,
    defaultSort?: string
}

export default function SmartFilters<T>({
    config,
    defaultSort = "createdAt-desc"
}: FilterInputProps<T>) {
    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Lógica URL
    const updateUrl = useCallback((key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value && value !== "all" && value !== defaultSort) { // Si tiene valor, no es "all" y no es el defaultSort
            params.set(key, value)
        } else {
            params.delete(key) // Si es "all", null o defaultSort, lo quitamos para limpiar la URL
        }

        if (key !== "page") params.delete("page")
        router.push(`${pathname}?${params.toString()}`, { scroll: false })

    }, [searchParams, pathname, router, defaultSort])

    const clearAll = () => router.push(pathname)
    const hasActiveFilters = searchParams.toString().length > 0;

    return (
        <div className="flex flex-wrap items-center gap-2">

            {/* SORT (Sin cambios mayores, solo value fallback seguro) */}
            {config.sort && config.sort.length > 0 && (
                <Select
                    value={searchParams.get("sort") || defaultSort}
                    onValueChange={(val) => updateUrl("sort", val)}
                >
                    <SelectTrigger className="w-auto min-w-[140px] h-9">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Ordenar" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt-desc">Más recientes</SelectItem>
                        <SelectItem value="createdAt-asc">Más antiguos</SelectItem>
                        {config.sort.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {/* FILTROS DINÁMICOS */}
            {config.filters?.map((filterConfig) => {
                // Obtenemos el valor actual o undefined (para que Radix muestre el placeholder)
                const currentValue = searchParams.get(filterConfig.key) || undefined;

                return (
                    <Select
                        key={filterConfig.key}
                        value={currentValue}
                        onValueChange={(val) => updateUrl(filterConfig.key, val)}
                    >
                        <SelectTrigger className="w-auto min-w-[140px] h-9 border-dashed">
                            <div className="flex items-center gap-2">
                                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                                {/* SelectValue mostrará automáticamente el label de la opción seleccionada */}
                                <SelectValue placeholder={filterConfig.label} />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {/* Usamos "all" explícitamente */}
                            <SelectItem value="all">Todos ({filterConfig.label})</SelectItem>
                            {filterConfig.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            })}

            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="h-9 px-2 lg:px-3"
                >
                    <X className="mr-2 h-4 w-4" />
                    Limpiar
                </Button>
            )}
        </div>
    );
}