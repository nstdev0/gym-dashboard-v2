"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { ProductsForm } from "../../components/products-form";
import { useParams } from "next/navigation";
import { useProductDetail } from "@/hooks/products/use-products";
import Loading from "../../loading";

export default function EditProductPage() {
    const params = useParams();
    const slug = params.slug as string;
    const productId = params.id as string;

    const { data: product, isLoading, isError } = useProductDetail(productId);

    if (isLoading) return <Loading />;

    if (isError || !product) {
        return (
            <DashboardLayout breadcrumbs={[]}>
                <div className="flex items-center justify-center h-full">
                    <p className="text-destructive">Error al cargar el producto. Intente nuevamente.</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout
            breadcrumbs={[
                { label: "Admin", href: `/${slug}/admin/dashboard` },
                { label: "Productos", href: `/${slug}/admin/products` },
                { label: "Editar" },
            ]}
        >
            <div className="flex-1 space-y-4 p-8 pt-6">
                <PageHeader
                    title={`Editar Producto: ${product.name}`}
                    description="Modifica los detalles del producto"
                />
                <div className="flex justify-center">
                    <ProductsForm initialData={product} />
                </div>
            </div>
        </DashboardLayout>
    );
}
