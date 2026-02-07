"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Organization } from "@/server/domain/entities/Organization";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDeleteOrganization } from "@/hooks/organizations/use-organizations";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface OrganizationsTableProps {
    organizations: Organization[];
}

const OrganizationActions = ({ organization, slug }: { organization: Organization; slug: string }) => {
    const { mutate: deleteOrganization, isPending } = useDeleteOrganization();
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        deleteOrganization(organization.id, {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <div className="flex justify-end gap-2">
            <Link href={`/${slug}/admin/organizations/${organization.id}/edit`}>
                <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                </Button>
            </Link>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la organización.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                            disabled={isPending}
                        >
                            {isPending ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export function OrganizationsTable({ organizations }: OrganizationsTableProps) {
    const params = useParams();
    const slug = params.slug as string;

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">Activo</Badge>
        ) : (
            <Badge variant="secondary">Inactivo</Badge>
        );
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {organizations.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                No se encontraron organizaciones
                            </TableCell>
                        </TableRow>
                    ) : (
                        organizations.map((org) => (
                            <TableRow key={org.id}>
                                <TableCell className="font-medium">{org.name}</TableCell>
                                <TableCell>{org.slug}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{org.id}</TableCell>
                                <TableCell>{getStatusBadge(org.isActive)}</TableCell>
                                <TableCell className="text-right">
                                    <OrganizationActions organization={org} slug={slug} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
