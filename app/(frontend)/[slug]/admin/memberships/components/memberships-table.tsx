"use client";

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getMembershipsColumns } from "./memberships-columns";

interface MembershipWithRelations {
    id: string;
    startDate: Date;
    endDate: Date;
    status: string;
    pricePaid: number;
    memberId: string;
    planId: string;
    member?: { firstName: string; lastName: string };
    plan?: { name: string };
    createdAt: Date;
    updatedAt: Date;
}

interface MembershipsTableProps {
    memberships: MembershipWithRelations[];
    slug: string;
}

export function MembershipsTable({ memberships, slug }: MembershipsTableProps) {
    const columns = getMembershipsColumns(slug);

    const table = useReactTable({
        data: memberships,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex-1 overflow-auto relative">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-secondary/90 backdrop-blur-sm">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="border-b border-border hover:bg-transparent"
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="px-4 py-3 font-semibold text-foreground uppercase text-xs"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="hover:bg-secondary/30 transition-colors border-b border-border"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-3 px-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No se encontraron membresías.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
