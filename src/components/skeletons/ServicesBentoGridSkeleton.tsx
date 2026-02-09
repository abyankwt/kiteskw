import { SkeletonCard } from "@/components/ui/Skeleton";

export function ServicesBentoGridSkeleton() {
    return (
        <section className="py-20 lg:py-32 bg-[#0B0F14] relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none opacity-30" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
                    {/* Wide card 1 */}
                    <div className="md:col-span-2">
                        <SkeletonCard />
                    </div>
                    {/* Regular card 2 */}
                    <div>
                        <SkeletonCard />
                    </div>
                    {/* Regular card 3 */}
                    <div>
                        <SkeletonCard />
                    </div>
                    {/* Wide card 4 */}
                    <div className="md:col-span-2">
                        <SkeletonCard />
                    </div>
                </div>
            </div>
        </section>
    );
}
