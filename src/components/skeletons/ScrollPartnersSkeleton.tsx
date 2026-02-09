import { Skeleton } from "@/components/ui/Skeleton";

export function ScrollPartnersSkeleton() {
    return (
        <section className="py-8 bg-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex gap-12 items-center justify-center">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex-shrink-0">
                            <Skeleton className="h-12 w-32" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
