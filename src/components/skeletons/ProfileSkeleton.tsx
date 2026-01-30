import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="relative">
                {/* Cover Skeleton */}
                <Skeleton className="h-[200px] md:h-[300px] w-full" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative -mt-16 sm:-mt-24 mb-6">
                        <div className="flex flex-col md:flex-row gap-6 items-end">
                            {/* Avatar Skeleton */}
                            <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background" />

                            {/* Info Skeleton */}
                            <div className="flex-1 space-y-2 mb-2 w-full">
                                <Skeleton className="h-8 w-1/3" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12">
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>

                {/* Bio Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        </div>
    );
};
