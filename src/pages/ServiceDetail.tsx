import { useParams, Link, Navigate } from "react-router-dom";
import { SEO } from "@/components/common/SEO";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { servicesDetailData } from "@/data/serviceDetailData";
import { ServiceDetailLayout } from "@/components/services/ServiceDetailLayout";

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { language } = useLanguage();

  const service = serviceId ? servicesDetailData[serviceId] : null;

  if (serviceId === 'training') {
    return <Navigate to="/training" replace />;
  }

  if (!service) {
    return (

      <div className="pt-32 pb-16 lg:pt-48">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            {language === "en" ? "Service Not Found" : "الخدمة غير موجودة"}
          </h1>
          <Link to="/services">
            <Button variant="outline">
              <ArrowLeft size={16} className="mr-2 rtl:rotate-180" />
              {language === "en" ? "Back to Services" : "العودة للخدمات"}
            </Button>
          </Link>
        </div>
      </div>

    );
  }

  return (
    <>
      <SEO page="services" serviceId={serviceId} />
      <ServiceDetailLayout data={service} />
    </>
  );
};

export default ServiceDetail;
