export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-4">
                <div className="h-12 bg-muted animate-pulse rounded" />
                <div className="h-64 bg-muted animate-pulse rounded" />
            </div>
        </div>
    );
}
