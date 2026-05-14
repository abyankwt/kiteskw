import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
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
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/common/ScrollToTop";
import { Layout } from "@/components/layout/Layout";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { PageTransition } from "@/components/transitions/PageTransition";
import { PrivateRoute } from "@/components/admin/PrivateRoute";
import AdminLogin from "@/pages/auth/AdminLogin";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AdminLayout from "@/pages/admin/AdminLayout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentFailure from "@/pages/PaymentFailure";
import { usePageViewTracker } from "@/hooks/usePageViewTracker";

const queryClient = new QueryClient();

const AppLayout = ({ showIntro }: { showIntro: boolean }) => {
    const location = useLocation();
    usePageViewTracker();

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
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/failure" element={<PaymentFailure />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/gallery" element={<Gallery />} />
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
        </>
    );
};

const App = () => (
    <HelmetProvider>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <LanguageProvider>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                            <ScrollToTop />
                            <Routes>
                                {/* Auth pages — no header/footer */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                {/* Admin routes — completely outside public Layout, SplashScreen, Header/Footer */}
                                <Route path="/admin/login" element={<AdminLogin />} />
                                <Route
                                    path="/admin/*"
                                    element={
                                        <PrivateRoute roles={['SUPER_ADMIN', 'ADMIN', 'STAFF']}>
                                            <AdminLayout />
                                        </PrivateRoute>
                                    }
                                />
                                {/* Public site */}
                                <Route path="/*" element={<AppContent />} />
                            </Routes>
                        </BrowserRouter>
                    </TooltipProvider>
                </LanguageProvider>
            </AuthProvider>
        </QueryClientProvider>
    </HelmetProvider>
);

export default App;
