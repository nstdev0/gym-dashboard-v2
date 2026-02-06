import { getContainer } from "@/server/di/container";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import MembershipForm from "../../components/memberships-form";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
    title: "Editar Membresía",
    description: "Editar información de la membresía",
};

interface Props {
    params: Promise<{ slug: string; id: string }>;
}

export default async function EditMembershipPage({ params }: Props) {
    const { slug, id } = await params;
    const container = await getContainer();

    // Fetch membership and plans (members are searched on demand)
    const [membership, plansResponse] = await Promise.all([
        container.getMembershipByIdController.execute(undefined, id),
        container.getAllPlansController.execute({ page: 1, limit: 100, filters: {} }),
    ]);

    if (!membership) {
        notFound();
    }

    const plans = plansResponse.records.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        durationDays: p.durationDays,
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/${slug}/admin/memberships/${id}`}>
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Editar Membresía</h1>
            </div>
            <MembershipForm
                initialData={membership}
                isEdit
                redirectUrl={`/${slug}/admin/memberships/${id}`}
                plans={plans}
            />
        </div>
    );
}
