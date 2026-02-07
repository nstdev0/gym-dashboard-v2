"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { Product, ProductType } from "@/server/domain/entities/Product";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { FilterConfiguration } from "@/components/ui/smart-filters";
import { useParams, useSearchParams } from "next/navigation";
import SmartFilters from "@/components/ui/smart-filters";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useProductsList } from "@/hooks/products/use-products";
import Loading from "../loading";
import { ProductsTable } from "./products-table";

export default function ProductsViewPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug as string;

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const type = searchParams.get("type") || undefined;
    const status = searchParams.get("status") || undefined;

    const { data: paginatedProducts, isLoading } = useProductsList({
        page,
        limit,
        search,
        sort,
        type,
        status,
    });

    const products = paginatedProducts?.records || [];
    const totalPages = paginatedProducts?.totalPages || 0;
    const totalRecords = paginatedProducts?.totalRecords || 0;

    const filtersConfig: FilterConfiguration<Product> = {
        sort: [
            { label: "Nombre (A-Z)", field: "name", value: "name-asc" },
            { label: "Nombre (Z-A)", field: "name", value: "name-desc" },
            { label: "Precio (Mayor a Menor)", field: "price", value: "price-desc" },
            { label: "Precio (Menor a Mayor)", field: "price", value: "price-asc" },
            { label: "Stock (Mayor a Menor)", field: "stock", value: "stock-desc" },
            { label: "Stock (Menor a Mayor)", field: "stock", value: "stock-asc" },
        ],

        filters: [
            {
                key: "type",
                label: "Tipo",
                options: [
                    { label: "Consumible", value: ProductType.CONSUMABLE },
                    { label: "Equipamiento", value: ProductType.GEAR },
                    { label: "Merch", value: ProductType.MERCH },
                    { label: "Servicio", value: ProductType.SERVICE },
                ]
            },
            {
                key: "status",
                label: "Estado",
                options: [
                    { label: "Activo", value: "active" },
                    { label: "Inactivo", value: "inactive" }
                ]
            }
        ]
    };

    return (
        <Suspense fallback={<Loading />}>
            <DashboardLayout
                breadcrumbs={[{ label: "Dashboard", href: `/${slug}/admin/dashboard` }, { label: "Productos" }]}
            >
                <PageHeader
                    title="Gestión de Productos"
                    description="Administra el inventario y servicios de tu gimnasio"
                    actions={
                        <Link href={`/${slug}/admin/products/new`}>
                            <Button size="sm" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nuevo Producto
                            </Button>
                        </Link>
                    }
                />
                <div className="flex flex-col h-full space-y-4 overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: "Total Productos", value: totalRecords.toString() },
                            { label: "En esta página", value: products.length.toString() },
                            // { label: "Bajo Stock", value: ??? }
                        ].map((stat, index) => (
                            <Card key={index} className="p-3">
                                <p className="text-xs text-muted-foreground mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-xl font-bold text-foreground">
                                    {isLoading ? "..." : stat.value}
                                </p>
                            </Card>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        {/* SearchInput necesita Suspense boundary, pero como toda la pagina 
                            esta envuelta, funcionará bien. */}
                        <SearchInput placeholder="Buscar por nombre, SKU..." />
                        <SmartFilters config={filtersConfig} />
                    </div>

                    <Card className="flex-1 overflow-hidden flex flex-col min-h-0">
                        {isLoading ? (
                            <div className="p-4 flex justify-center items-center h-full">Cargando...</div>
                        ) : (
                            <>
                                <ProductsTable products={products} />
                                <div className="p-2 border-t bg-background">
                                    <Pagination currentPage={page} totalPages={totalPages} />
                                </div>
                            </>
                        )}

                    </Card>
                </div>
            </DashboardLayout>
        </Suspense>
    );
}
