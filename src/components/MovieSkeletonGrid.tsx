import { MovieSkeletonCard } from "./MovieSkeletonCard";

export function MovieSkeletonGrid({ count, viewMode }: { count: number, viewMode: 'grid' | 'list' }) {
    return (
        <ul className={
            viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 justify-items-center'
                : 'flex flex-col gap-6'
        }>
            {Array.from({ length: count }).map((_, i) => (
                <li key={i}><MovieSkeletonCard viewMode={viewMode} /></li>
            ))}
        </ul>
    );
} 