import { cn } from '@/lib/utils';

export function CourseCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-100" />
            <div className="p-4 space-y-2">
                <div className="h-3 w-16 bg-gray-100 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-2/3 bg-gray-100 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded mt-3" />
            </div>
        </div>
    );
}

export function RoleCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
            <div className="h-8 w-8 bg-gray-100 rounded mb-3" />
            <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
            <div className="h-3 w-full bg-gray-100 rounded mb-1" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
            <div className="h-5 w-20 bg-gray-100 rounded-full mt-3" />
        </div>
    );
}

export function CourseListSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 animate-pulse">
            <div className="w-[120px] h-[68px] rounded-lg bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-gray-100 rounded" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Welcome banner skeleton */}
            <div className="bg-gray-100 rounded-xl p-6 h-32" />

            {/* Course grid skeleton */}
            <div>
                <div className="h-5 w-40 bg-gray-100 rounded mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CourseCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
