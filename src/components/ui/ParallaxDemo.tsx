import { ParallaxSection, ParallaxImage, MultiLayerParallax } from '@/components/ui/ParallaxSection';
import { useParallax } from '@/hooks/useParallax';

/**
 * ParallaxDemo Component
 * 
 * Showcases different parallax techniques:
 * 1. Simple background parallax
 * 2. Image parallax
 * 3. Multi-layer parallax
 * 4. Custom parallax with useParallax hook
 */

export function ParallaxDemo() {
    // Custom parallax using the hook directly
    const { ref: customRef, offset: customOffset } = useParallax({ speed: 0.4 });

    return (
        <div className="space-y-32">
            {/* Example 1: Simple Background Parallax */}
            <ParallaxSection
                speed={0.2}
                className="min-h-[500px] flex items-center justify-center"
                bgClassName="bg-gradient-to-br from-blue-900/20 to-purple-900/20"
            >
                <div className="text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Simple Parallax</h2>
                    <p className="text-xl opacity-80">Background moves at 20% scroll speed</p>
                </div>
            </ParallaxSection>

            {/* Example 2: Image Parallax */}
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Image Parallax</h2>
                <ParallaxImage
                    src="/images/hero-bg.jpg"
                    alt="Parallax demonstration"
                    speed={0.3}
                    className="h-[400px] rounded-lg"
                />
            </div>

            {/* Example 3: Multi-Layer Parallax */}
            <MultiLayerParallax
                className="min-h-[600px] flex items-center justify-center"
                layers={[
                    {
                        speed: 0.1,
                        className: 'bg-gradient-to-b from-indigo-900/30 to-transparent',
                    },
                    {
                        speed: 0.2,
                        className: 'bg-gradient-to-t from-purple-900/20 to-transparent',
                    },
                    {
                        speed: 0.3,
                        children: (
                            <div className="absolute inset-0 opacity-10">
                                {/* Decorative elements that move at different speeds */}
                                <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl" />
                                <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-2xl" />
                            </div>
                        ),
                    },
                ]}
            >
                <div className="text-center text-white px-4">
                    <h2 className="text-4xl font-bold mb-4">Multi-Layer Parallax</h2>
                    <p className="text-xl opacity-80 max-w-2xl mx-auto">
                        Three background layers moving at different speeds create depth
                    </p>
                </div>
            </MultiLayerParallax>

            {/* Example 4: Custom Hook Usage */}
            <div className="container mx-auto px-4">
                <div className="relative min-h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden">
                    {/* Custom parallax element */}
                    <div
                        ref={customRef}
                        className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20"
                        style={{
                            transform: `translateY(${customOffset}px)`,
                        }}
                    />

                    <div className="relative z-10 flex items-center justify-center h-full p-12 text-white">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-4">Custom Hook Usage</h2>
                            <p className="text-lg opacity-80">
                                Using useParallax hook directly for fine control
                            </p>
                            <div className="mt-6 text-sm opacity-60">
                                Current offset: {Math.round(customOffset)}px
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
