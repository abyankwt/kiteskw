import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { Check, ShieldCheck, Headphones, Server, Laptop } from "lucide-react";

interface FeatureItem {
    title: string;
    desc: string;
}

interface SoftwareFeaturesProps {
    data: {
        title: string;
        items: FeatureItem[];
    };
}

export const SoftwareFeatures = ({ data }: SoftwareFeaturesProps) => {
    // Map icons based on content (simple heuristic)
    const getIcon = (title: string) => {
        if (title.toLowerCase().includes('support')) return Headphones;
        if (title.toLowerCase().includes('setup') || title.toLowerCase().includes('server')) return Server;
        if (title.toLowerCase().includes('distributor') || title.toLowerCase().includes('license')) return ShieldCheck;
        return Laptop;
    };

    return (
        <section className="py-20 lg:py-32 bg-background border-b border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <ScrollReveal>
                        <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                            {data.title}
                        </h2>
                        <p className="font-body text-lg text-muted-foreground leading-relaxed">
                            KITES is more than just a reseller. We are a technical partner that spans the entire software lifecycle—from initial sizing and localized procurement to high-performance infrastructure integration and post-deployment support.
                        </p>
                    </ScrollReveal>

                    <StaggerContainer className="space-y-6" staggerDelay={100}>
                        {data.items.map((item, index) => {
                            const Icon = getIcon(item.title);
                            return (
                                <StaggerItem key={index} index={index}>
                                    <div className="flex gap-4 p-4 rounded-xl hover:bg-secondary/20 transition-colors border border-transparent hover:border-border/60 group">
                                        <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <Icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h3 className="font-heading text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                </div>
            </div>
        </section>
    );
};
