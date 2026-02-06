import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MembershipForm from "../components/memberships-form";
import { Metadata } from "next";
import { getContainer } from "@/server/di/container";

export const metadata: Metadata = {
    title: "Nueva Membresía",
    description: "Crear una nueva membresía",
};

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function NewMembershipPage({ params }: Props) {
    const { slug } = await params;
    const container = await getContainer();

    // Fetch only plans (members are searched on demand)
    const plansResponse = await container.getAllPlansController.execute({
        page: 1,
        limit: 100,
        filters: {},
    });

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
                    <Link href={`/${slug}/admin/memberships`}>
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Nueva Membresía</h1>
            </div>
            <MembershipForm
                redirectUrl={`/${slug}/admin/memberships`}
                plans={plans}
            />
        </div>
    );
}
