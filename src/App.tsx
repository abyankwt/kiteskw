import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Expertise from "./pages/Expertise";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Training from "./pages/Training";
import Partners from "./pages/Partners";
import PartnerDetail from "./pages/PartnerDetail";
import Insights from "./pages/Insights";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/common/ScrollToTop";
import { Layout } from "@/components/layout/Layout";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { PageTransition } from "@/components/transitions/PageTransition";
import { CustomCursor } from "@/components/ui/CustomCursor";

const queryClient = new QueryClient();

// Wrapper for Layout to handle location-based re-renders if needed, 
// though here we mainly need it to pass the hidden state.
const AppLayout = ({ showIntro }: { showIntro: boolean }) => {
    const location = useLocation();

    return (
        <Layout hidden={showIntro}>
            <PageTransition variant="fade">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Index />} />
                    <Route path="/expertise" element={<Expertise />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:serviceId" element={<ServiceDetail />} />
                    <Route path="/training" element={<Training />} />
                    <Route path="/partners" element={<Partners />} />
                    <Route path="/partners/:partnerId" element={<PartnerDetail />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </PageTransition>
        </Layout>
    );
};


const AppContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [previousPath, setPreviousPath] = useState(location.pathname);

    // Trigger splash screen on route change
    useEffect(() => {
        if (location.pathname !== previousPath) {
            setIsLoading(true);
            setPreviousPath(location.pathname);
        }
    }, [location.pathname, previousPath]);

    const handleSplashComplete = () => {
        setIsLoading(false);
    };

    return (
        <>
            {isLoading && <SplashScreen onComplete={handleSplashComplete} />}
            <AppLayout showIntro={isLoading} />
            <CustomCursor />
        </>
    );
};

const App = () => (
    <HelmetProvider>
        <QueryClientProvider client={queryClient}>
            <LanguageProvider>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <ScrollToTop />
                        <AppContent />
                    </BrowserRouter>
                </TooltipProvider>
            </LanguageProvider>
        </QueryClientProvider>
    </HelmetProvider>
);

export default App;
