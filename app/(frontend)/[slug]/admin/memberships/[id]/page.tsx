import { getContainer } from "@/server/di/container";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronLeft, Edit } from "lucide-react";
import MembershipDetail from "./membership-detail";

export const metadata: Metadata = {
    title: "Detalle de Membresía",
    description: "Ver información de la membresía",
};

interface Props {
    params: Promise<{ slug: string; id: string }>;
}

export default async function MembershipDetailPage({ params }: Props) {
    const { slug, id } = await params;
    const container = await getContainer();

    const membership = await container.getMembershipByIdController.execute(undefined, id);

    if (!membership) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/${slug}/admin/memberships`}>
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Detalle de Membresía</h1>
                </div>
                <Button asChild>
                    <Link href={`/${slug}/admin/memberships/${id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Editar
                    </Link>
                </Button>
            </div>
            <MembershipDetail membership={membership} />
        </div>
    );
}
