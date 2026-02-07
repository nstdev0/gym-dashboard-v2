import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { ProductsForm } from "../components/products-form";

export default async function NewProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <DashboardLayout
            breadcrumbs={[
                { label: "Admin", href: `/${slug}/admin/dashboard` },
                { label: "Productos", href: `/${slug}/admin/products` },
                { label: "Nuevo" },
            ]}
        >
            <div className="flex-1 space-y-4 p-8 pt-6">
                <PageHeader
                    title="Nuevo Producto"
                    description="Crea un nuevo producto en tu inventario"
                />
                <div className="flex justify-center">
                    <ProductsForm />
                </div>
            </div>
        </DashboardLayout>
    );
}
