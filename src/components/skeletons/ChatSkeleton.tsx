import { Skeleton } from "@/components/ui/skeleton";

export const ConversationListSkeleton = () => {
    return (
        <div className="flex flex-col h-full bg-muted/10">
            <div className="p-4 border-b bg-card">
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="flex flex-col p-4 space-y-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 pb-4 border-b border-border/40 last:border-0">
                        <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                        <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                            <Skeleton className="h-3 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ChatWindowSkeleton = () => {
    return (
        <div className="flex flex-col h-full bg-muted/5 animate-in fade-in">
            {/* Header Skeleton */}
            <div className="p-4 border-b flex items-center gap-3 bg-card shadow-sm z-10">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>

            {/* Messages Area Skeleton */}
            <div className="flex-1 p-4 space-y-6 overflow-hidden">
                <div className="flex justify-start">
                    <Skeleton className="h-10 w-2/3 rounded-2xl rounded-tl-sm bg-muted-foreground/10" />
                </div>
                <div className="flex justify-end">
                    <Skeleton className="h-14 w-1/2 rounded-2xl rounded-tr-sm bg-primary/10" />
                </div>
                <div className="flex justify-start">
                    <Skeleton className="h-20 w-3/4 rounded-2xl rounded-tl-sm bg-muted-foreground/10" />
                </div>
                <div className="flex justify-end">
                    <Skeleton className="h-8 w-1/3 rounded-2xl rounded-tr-sm bg-primary/10" />
                </div>
            </div>

            {/* Input Area Skeleton */}
            <div className="p-4 border-t bg-card mt-auto">
                <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                </div>
            </div>
        </div>
    )
}
