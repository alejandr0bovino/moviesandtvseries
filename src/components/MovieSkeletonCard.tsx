import { Skeleton } from "@heroui/react";

export function MovieSkeletonCard({ viewMode }: { viewMode: 'grid' | 'list' }) {
    if (viewMode === 'grid') {
        return (
            <div className="bg-white rounded-xl border border-[#E5E7EC] bg-[#E5E7EC] w-[229px] h-[410px] p-4">
                <Skeleton className="w-full h-[280px] rounded-md mb-4 bg-[#E5E7EC] cm-skeleton" />
                <Skeleton className="w-3/4 h-6 mb-2 rounded-md mb-3 bg-[#E5E7EC] cm-skeleton" />
                <Skeleton className="w-1/2 h-4 mb-2 rounded-md mb-3 bg-[#E5E7EC] cm-skeleton" />
                <Skeleton className="w-full h-4 rounded-md bg-[#E5E7EC] cm-skeleton" />
            </div>
        );
    }
    // List view
    return (
        <div className="flex gap-6 w-full p-4 rounded-xl border border-[#E5E7EC] bg-[#E5E7EC] bg-white h-[200px]">
            <Skeleton className="w-28 h-full rounded-md flex-shrink-0 bg-[#E5E7EC] cm-skeleton" />
            <div className="flex flex-col flex-1">
                <Skeleton className="w-1/2 h-6 rounded-md mb-3 bg-[#E5E7EC] cm-skeleton" />
                <Skeleton className="w-1/4 h-4 rounded-md mb-3 bg-[#E5E7EC] cm-skeleton" />
                <Skeleton className="w-full h-4 rounded-md mb-3 bg-[#E5E7EC] cm-skeleton" />
                <Skeleton className="w-full h-4 rounded-md bg-[#E5E7EC] cm-skeleton" />
            </div>
        </div>
    );
} 