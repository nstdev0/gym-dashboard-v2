import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface DataTableSkeletonProps {
    rowCount?: number
    columnCount?: number
    showAction?: boolean
}

export function DataTableSkeleton({
    rowCount = 10,
    columnCount = 5,
    showAction = true,
}: DataTableSkeletonProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Array.from({ length: columnCount }).map((_, i) => (
                            <TableHead key={i}>
                                <Skeleton className="h-4 w-[100px]" />
                            </TableHead>
                        ))}
                        {showAction && (
                            <TableHead className="w-[50px]">
                                <Skeleton className="h-4 w-8" />
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rowCount }).map((_, i) => (
                        <TableRow key={i}>
                            {Array.from({ length: columnCount }).map((_, j) => (
                                <TableCell key={j}>
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                            ))}
                            {showAction && (
                                <TableCell>
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
