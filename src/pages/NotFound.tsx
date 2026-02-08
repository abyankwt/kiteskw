import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/common/SEO";
import { LottiePlayer } from "@/components/ui/LottiePlayer";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Friendly 404 animation
  const notFoundAnimationUrl = "https://lottie.host/1c0f4b8a-7f4e-4f55-b89d-3c8c7e7b59a0/OguzGKZjFu.json";

  return (
    <>
      <SEO page="notFound" />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4">
        <div className="text-center max-w-md">
          {/* Lottie Animation */}
          <div className="w-64 h-64 mx-auto mb-8">
            <LottiePlayer
              animationData={notFoundAnimationUrl}
              loop={true}
              autoplay={true}
              speed={1}
              lazyLoad={false}
              ariaLabel="404 not found illustration"
            />
          </div>

          <h1 className="mb-4 text-5xl font-heading font-bold text-foreground">404</h1>
          <p className="mb-2 text-2xl font-heading font-semibold text-foreground">Page Not Found</p>
          <p className="mb-8 text-base text-muted-foreground max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <Home size={18} />
            Return to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
