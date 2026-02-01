import { Boxes, MessageSquare, GraduationCap, Package, Cpu, LineChart, Leaf, Factory, Building2, Car, Zap, HardHat, Beaker, Globe, ShieldCheck } from "lucide-react";
import { LucideIcon } from "lucide-react";

// Partner Logos
import dassaultLogo from '@/assets/partners/dassault.svg';
import solidworksLogo from '@/assets/partners/solidworks.svg';
import simuliaLogo from '@/assets/partners/simulia.svg';
import mscLogo from '@/assets/partners/msc.svg';
import cypeLogo from '@/assets/partners/cype.svg';
import simlabLogo from '@/assets/partners/simlab.svg';
import driveworksLogo from '@/assets/partners/driveworks.svg';
import chaosLogo from '@/assets/partners/chaos.svg';
import simaproLogo from '@/assets/partners/simapro.svg';
import maxqdaLogo from '@/assets/partners/maxqda.svg';
import crealityLogo from '@/assets/partners/creality.svg';
import herowearLogo from '@/assets/partners/herowear.svg';

export interface ServiceDetailContent {
    head: {
        title: string;
        subtitle: string;
    };
    overview: {
        title: string; // "What This Service Solves"
        content: string;
        quote?: string;
    };

    // "What We Deliver" (List of deliverables)
    deliverables?: {
        title: string;
        items: string[];
    };

    // "Consultation Domains" (Cards)
    domains?: {
        title: string;
        items: {
            title: string;
            desc: string;
            icon?: LucideIcon;
            capabilities?: string[];
        }[];
    };

    // "Industries We Support" (Icon Grid)
    industries?: {
        title: string;
        items: {
            name: string;
            icon: LucideIcon;
        }[];
    };

    // "Partners" (Software Logos)
    partners?: {
        title: string;
        items: {
            name: string;
            desc: string;
            logo: string;
            color: string;
        }[];
    };

    // "Features" (Why Choose Us)
    features?: {
        title: string;
        items: {
            title: string;
            desc: string;
        }[];
    };

    // "How KITES Supports You" (Process Steps)

    // "How KITES Supports You" (Process Steps)
    process?: {
        title: string;
        steps: {
            title: string;
            desc: string;
        }[];
    };

    // Legacy/Simple "How We Deliver" (for other services) or "Business Impact"
    delivery?: {
        title: string;
        steps: string[];
    };

    impact: {
        title: string; // "Business Impact"
        outcomes: string[];
    };

    // Institute Info (Static Block)
    institute_info?: {
        name: string;
        address: string;
        phone: string;
    };

    // "Training Courses Catalogue" (Accordion)
    courses?: {
        title: string;
        items: {
            title: string;
            duration: string; // "Days: X | Hrs: Y | Z HRS/DAY"
            desc: string;
            outline: string[];
            who_should_attend: string[];
            standards?: string;
        }[];
    };

    cta: {
        title?: string;
        text: string;
        button: string;
    };
}

export interface ServiceData {
    id: string;
    icon: LucideIcon;
    en: ServiceDetailContent;
    ar: ServiceDetailContent;
}

export const servicesDetailData: Record<string, ServiceData> = {
    "prototype-development": {
        id: "prototype-development",
        icon: Boxes,
        en: {
            head: {
                title: "Prototype Development",
                subtitle: "Accelerate innovation with physics-based digital prototyping.",
            },
            overview: {
                title: "What This Service Solves",
                content: "Traditional prototyping is slow, expensive, and risky. We eliminate costly iteration cycles by validating designs digitally before manufacturing, allowing you to explore more design variants with higher confidence.",
                quote: "Eliminate costly iteration cycles by validating designs digitally before manufacturing.",
            },
            delivery: {
                title: "How We Deliver",
                steps: [
                    "Physics-based digital twins",
                    "Material behavior analysis",
                    "Stress & failure prediction",
                    "Virtual performance testing",
                    "Design optimization iterations"
                ],
            },
            impact: {
                title: "Business Impact",
                outcomes: ["Reduced Time-to-Market", "Lower R&D Costs", "Design Confidence", "Data-Driven Innovation"]
            },
            cta: {
                text: "Ready to accelerate your product development?",
                button: "Talk to Our Experts",
            }
        },
        ar: {
            head: {
                title: "تطوير النماذج الأولية",
                subtitle: "تسريع الابتكار باستخدام النماذج الأولية الرقمية القائمة على الفيزياء.",
            },
            overview: {
                title: "ما تقدمه هذه الخدمة",
                content: "النماذج الأولية التقليدية بطيئة ومكلفة ومحفوفة بالمخاطر. نحن نقضي على دورات التكرار المكلفة من خلال التحقق من التصاميم رقميًا قبل التصنيع، مما يسمح لك باستكشاف المزيد من متغيرات التصميم بثقة أعلى.",
                quote: "القضاء على دورات التكرار المكلفة من خلال التحقق من التصاميم رقمياً قبل التصنيع.",
            },
            delivery: {
                title: "كيف نقدم الخدمة",
                steps: [
                    "توائم رقمية قائمة على الفيزياء",
                    "تحليل سلوك المواد",
                    "تنبؤ الإجهاد والفشل",
                    "اختبار الأداء الافتراضي",
                    "تكرارات تحسين التصميم"
                ],
            },
            impact: {
                title: "تأثير الأعمال",
                outcomes: ["تقليل وقت الوصول للسوق", "خفض تكاليف البحث والتطوير", "ثقة في التصميم", "ابتكار مدفوع بالبيانات"]
            },
            cta: {
                text: "هل أنت مستعد لتسريع تطوير منتجك؟",
                button: "تحدث إلى خبرائنا",
            }
        },
    },
    "consultation": {
        id: "consultation",
        icon: LineChart,
        en: {
            head: {
                title: "Engineering & Sustainability Consultation",
                subtitle: "Decisive, data-driven engineering solutions for complex industrial challenges.",
            },
            overview: {
                title: "Executive Summary",
                content: "We provide comprehensive simulation-based consulting and sustainability expertise to solve your most critical engineering challenges. From optimizing renewable energy systems to ensuring rigorous environmental compliance, our data-driven approach empowers confident decision-making for government and enterprise initiatives.",
                quote: "Decisive, data-driven engineering solutions for complex industrial challenges.",
            },
            domains: {
                title: "Consultation Domains",
                items: [
                    {
                        title: "Simulation & CAE",
                        desc: "High-fidelity numerical modeling for performance validation.",
                        icon: Cpu,
                        capabilities: ["Finite Element Analysis (FEA)", "Computational Fluid Dynamics (CFD)", "Conjugate Heat Transfer (CHT)", "Multiphysics Coupling", "Dynamic & Transient Analysis"]
                    },
                    {
                        title: "CAD & CAM Engineering",
                        desc: "Digital design and manufacturing preparation.",
                        icon: Boxes,
                        capabilities: ["3D Parametric Modeling", "Technical Drafting (2D/3D)", "Design for Manufacturing (DFM)", "Assembly Analysis", "Reverse Engineering"]
                    },
                    {
                        title: "Advanced Research",
                        desc: "Numerical methods for cutting-edge R&D.",
                        icon: Beaker,
                        capabilities: ["Mathematical Modeling", "Algorithm Development", "Experimental Validation", "Custom Simulation Workflows", "Scientific Computing"]
                    },
                    {
                        title: "Environmental Sustainability",
                        desc: "Strategies for ecological impact reduction.",
                        icon: Leaf,
                        capabilities: ["Life Cycle Assessment (LCA)", "Environmental Product Declarations (EPD)", "Carbon Footprint Analysis", "Regulatory Compliance Reports", "Green Building Certification Support"]
                    },
                    {
                        title: "Waste Management",
                        desc: "Technologies for efficient waste optimization.",
                        icon: ShieldCheck,
                        capabilities: ["Waste-to-Energy Systems", "Circular Economy Strategies", "Process Efficiency Analysis", "Emissions Monitoring", "Sustainable Disposal Planning"]
                    },
                    {
                        title: "Energy Systems",
                        desc: "Renewable and conventional power optimization.",
                        icon: Zap,
                        capabilities: ["Renewable Energy Integration", "Oil & Gas Process Optimization", "Thermal Management Systems", "Energy Audit & Efficiency", "Grid Stability Analysis"]
                    },
                    {
                        title: "Manufacturing & 3D Printing",
                        desc: "Modernizing production capabilities.",
                        icon: Factory,
                        capabilities: ["Additive Manufacturing Consulting", "Process Simulation", "Production Line Optimization", "Material Selection", "Tooling Design"]
                    },
                    {
                        title: "Civil & Infrastructure",
                        desc: "Resilient built environments.",
                        icon: HardHat,
                        capabilities: ["Structural Integrity Analysis", "Wind Load Simulation", "Crowd Flow Dynamics", "Urban Microclimate Analysis", "Safety Remediation"]
                    },
                    {
                        title: "MEP Systems",
                        desc: "Integrated mechanical, electrical, and plumbing analysis.",
                        icon: Building2,
                        capabilities: ["HVAC Airflow Optimization", "Thermal Comfort Analysis", "Piping Stress Analysis", "Fire & Smoke Simulation", "Energy Consumption Modeling"]
                    },
                    {
                        title: "Automotive Engineering",
                        desc: "Vehicle performance and safety simulations.",
                        icon: Car,
                        capabilities: ["Crashworthiness & Safety", "NVH (Noise, Vibration, Harshness)", "Aerodynamics Optimization", "Thermal Management", "Component Durability"]
                    },
                ]
            },
            industries: {
                title: "Industries We Support",
                items: [
                    { name: "Energy & Power", icon: Zap },
                    { name: "Manufacturing", icon: Factory },
                    { name: "Civil & Infrastructure", icon: HardHat },
                    { name: "MEP & HVAC", icon: Building2 },
                    { name: "Automotive", icon: Car },
                    { name: "Research & Academia", icon: Beaker },
                    { name: "Government", icon: Globe },
                ]
            },
            process: {
                title: "How We Work",
                steps: [
                    { title: "1. Problem Definition & Scope", desc: "We collaborate to strictly define operational parameters, failure modes, and project success criteria." },
                    { title: "2. Simulation & Analysis", desc: "Engineers apply rigorous physics-based modeling and CAE tools to replicate real-world conditions." },
                    { title: "3. Validation & Optimization", desc: "Results are cross-verified against empirical data to drive design refinements and efficiency." },
                    { title: "4. Advisory & Implementation", desc: "We deliver technical reports, certification support, and direct implementation guidance." }
                ]
            },
            impact: {
                title: "Business Impact",
                outcomes: ["Risk Mitigation", "Operational Efficiency", "Safety Assurance", "Regulatory Compliance"]
            },
            cta: {
                title: "Not sure if we can help?",
                text: "Speak directly with KITES engineers for a focused, simulation-driven consultation.",
                button: "Request a Free Consultation",
            }
        },
        ar: {
            head: {
                title: "الاستشارات الهندسية والاستدامة",
                subtitle: "حلول هندسية حاسمة ومدعومة بالبيانات للتحديات الصناعية المعقدة.",
            },
            overview: {
                title: "ملخص تنفيذي",
                content: "نقدم استشارات شاملة قائمة على المحاكاة وخبرات في الاستدامة لحل تحدياتك الهندسية الأكثر أهمية. من تحسين أنظمة الطاقة المتجددة إلى ضمان الامتثال البيئي الصارم، يُمكّن نهجنا المدعوم بالبيانات من اتخاذ قرارات واثقة للمبادرات الحكومية والمؤسسية.",
                quote: "حلول هندسية حاسمة ومدعومة بالبيانات للتحديات الصناعية المعقدة.",
            },
            domains: {
                title: "مجالات الاستشارة",
                items: [
                    {
                        title: "المحاكاة والهندسة بمساعدة الحاسوب",
                        desc: "نمذجة رقمية عالية الدقة للتحقق من الأداء.",
                        icon: Cpu,
                        capabilities: ["تحليل العناصر المحدودة (FEA)", "ديناميكا الموائع الحسابية (CFD)", "نقل الحرارة المترافق (CHT)", "الاقتران متعدد الفيزياء", "التحليل الديناميكي والعابر"]
                    },
                    {
                        title: "تصميم وتصنيع بمساعدة الحاسوب",
                        desc: "التصميم الرقمي والتحضير للتصنيع.",
                        icon: Boxes,
                        capabilities: ["النمذجة البارامترية ثلاثية الأبعاد", "الرسم الفني (2D/3D)", "التصميم للتصنيع (DFM)", "تحليل التجميع", "الهندسة العكسية"]
                    },
                    {
                        title: "البحث المتقدم",
                        desc: "طرق عددية للبحث والتطوير المتقدم.",
                        icon: Beaker,
                        capabilities: ["النمذجة الرياضية", "تطوير الخوارزميات", "التحقق التجريبي", "سير عمل المحاكاة المخصص", "الحوسبة العلمية"]
                    },
                    {
                        title: "الاستدامة البيئية",
                        desc: "يستراتيجيات للحد من الأثر البيئي.",
                        icon: Leaf,
                        capabilities: ["تقييم دورة الحياة (LCA)", "إعلانات المنتج البيئية (EPD)", "تحليل البصمة الكربونية", "تقارير الامتثال التنظيمي", "دعم شهادات المباني الخضراء"]
                    },
                    {
                        title: "إدارة النفايات",
                        desc: "تنيات لتحسين كفاءة النفايات.",
                        icon: ShieldCheck,
                        capabilities: ["أنظمة تحويل النفايات إلى طاقة", "استراتيجيات الاقتصاد الدائري", "تحليل كفاءة العمليات", "مراقبة الانبعاثات", "تخطيط التخلص المستدام"]
                    },
                    {
                        title: "أنظمة الطاقة",
                        desc: "تحسين الطاقة التقليدية والمتجددة.",
                        icon: Zap,
                        capabilities: ["دمج الطاقة المتجددة", "تحسين عمليات النفط والغاز", "أنظمة الإدارة الحرارية", "تدقيق وكفاءة الطاقة", "تحليل استقرار الشبكة"]
                    },
                    {
                        title: "التصنيع والطباعة ثلاثية الأبعاد",
                        desc: "تحديث قدرات الإنتاج.",
                        icon: Factory,
                        capabilities: ["استشارات التصنيع الإضافي", "محاكاة العمليات", "تحسين خطوط الإنتاج", "اختيار المواد", "تصميم القوالب والأدوات"]
                    },
                    {
                        title: "الهندسة المدنية والبنية التحتية",
                        desc: "بيئات مبنية مرنة.",
                        icon: HardHat,
                        capabilities: ["تحليل السلامة الهيكلية", "محاكاة أحمال الرياح", "ديناميكيات تدفق الحشود", "تحليل المناخ المحلي الحضري", "معالجة السلامة"]
                    },
                    {
                        title: "أنظمة MEP",
                        desc: "تحليل متكامل للميكانيكا والكهرباء والسباكة.",
                        icon: Building2,
                        capabilities: ["تحسين تدفق الهواء HVAC", "تحليل الراحة الحرارية", "تحليل إجهاد الأنابيب", "محاكاة الحريق والدخان", "نمذجة استهلاك الطاقة"]
                    },
                    {
                        title: "هندسة السيارات",
                        desc: "محاكاة أداء وسلامة المركبات.",
                        icon: Car,
                        capabilities: ["التحمل والسلامة من التصادم", "الضوضاء والاهتزاز والخشونة (NVH)", "تحسين الديناميكا الهوائية", "الإدارة الحرارية", "متانة المكونات"]
                    },
                ]
            },
            industries: {
                title: "القطاعات التي ندعمها",
                items: [
                    { name: "الطاقة والقوى", icon: Zap },
                    { name: "التصنيع", icon: Factory },
                    { name: "الإنشاءات والبنية التحتية", icon: HardHat },
                    { name: "الميكانيكا والكهرباء (MEP)", icon: Building2 },
                    { name: "السيارات", icon: Car },
                    { name: "البحث والأوساط الأكاديمية", icon: Beaker },
                    { name: "القطاع الحكومي", icon: Globe },
                ]
            },
            process: {
                title: "كيف نعمل",
                steps: [
                    { title: "1. تعريف المشكلة والنطاق", desc: "نعمل سويًا لتحديد المعايير التشغيلية وأنماط الفشل ومعايير نجاح المشروع بدقة." },
                    { title: "2. المحاكاة والتحليل", desc: "يطبق مهندسونا نمذجة فيزيائية دقيقة وأدوات CAE لمحاكاة ظروف العالم الحقيقي." },
                    { title: "3. التحقق والتحسين", desc: "يتم التحقق من النتائج مقابل البيانات التجريبية لدفع تحسينات التصميم والكفاءة." },
                    { title: "4. الاستشارة والتنفيذ", desc: "نقدم تقارير فنية، ودعم الشهادات، وإرشادات التنفيذ المباشرة." }
                ]
            },
            impact: {
                title: "تأثير الأعمال",
                outcomes: ["تخفيف المخاطر", "الكفاءة التشغيلية", "ضمان السلامة", "الامتثال التنظيمي"]
            },
            cta: {
                title: "لست متأكداً مما إذا كنا نستطيع المساعدة؟",
                text: "تحدث مباشرة مع مهندسي KITES للحصول على استشارة مركزة.",
                button: "اطلب استشارة مجانية",
            }
        }
    },
    "training": {
        id: "training",
        icon: GraduationCap,
        en: {
            head: {
                title: "Professional Expert Training",
                subtitle: "High-fidelity engineering, sustainability, and simulation training delivered by KITES.",
            },
            institute_info: {
                name: "Kuwait Institute for Training & Engineering Simulations (KITES)",
                address: "P.O. Box 202, Surra, 45703, Kuwait",
                phone: "+965 94738558"
            },
            overview: {
                title: "Executive Summary",
                content: "The course provides insight on designing an EMS and assessing current EMS for various industries. Individuals will learn the skills of how to design and implement an environmental management system and be introduced to various methodologies used within the sustainability work frame to develop and improve environmental management programs. The course familiarizes individuals with ISO guidelines and procedures for an EMS to minimize risks from environmental calamities.",
                quote: "Bridge the skills gap by equipping your team with certified simulation expertise.",
            },
            courses: {
                title: "Available Professional Training Programs",
                items: [
                    {
                        title: "Assessment and Design of Environmental Management Systems",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "The course provides insight on designing an EMS and assessing current EMS for various industries. Individuals will learn the skills of how to design and implement an environmental management system and be introduced to various methodologies used within the sustainability work frame to develop and improve environmental management programs. The course familiarizes individuals with ISO guidelines and procedures for an EMS to minimize risks from environmental calamities.",
                        outline: [
                            "Day 1: Introduction to environmental management systems (EMS), Economic impact of EMS, Implementation of EMS, Principles of EMS risk management",
                            "Day 2: Planning and identifying environmental aspects, EMS standards, Guide to ISO standards, EMS implementation, Difference between EMS and ISO",
                            "Day 3: Planning an Environmental Policy, Requirements for ISO and EMS, Setting objectives and targets",
                            "Day 4: Auditing skills, Developing an EMS, Project management for developing EMS, Types of audits, Audit approaches, Audit objectives, scope, and criteria, Audit competence, principles, and methodology, Program roles and responsibilities",
                            "Day 5: Developing an environmental audit program, Monitoring and measuring, Corrective actions, Management review, EMS documentation"
                        ],
                        who_should_attend: ["Design Engineers", "Environmentalists", "Architects", "Civil / Environmental Engineers", "Governmental sector employees", "University students"],
                        standards: "ISO 14001 – Environmental Management System"
                    },
                    {
                        title: "Electric Wiring and Lighting for Residentials and Commercial Buildings",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "Introduction of specialized functions for specialized data analysis with various examples. Gain knowledge of electric wiring and lighting for residential and commercial buildings. Get exposed to methods for the design, installation, protection and analysis of various types of electric wiring and lighting. Employ computer simulation software to solve practical case studies.",
                        outline: [
                            "Day 1: Introduction to Electric Machinery and Drives I",
                            "Day 2: Introduction to LabVIEW, Building Virtual Instruments (VI), Using Data Acquisition (DAQ) Cards",
                            "Day 3: Electric Machinery and Drives II",
                            "Day 4: Workshop 1: Applications and Control of Electric Drives using LabVIEW",
                            "Day 5: Workshop 2: Applications and Control of Electric Drives using LabVIEW"
                        ],
                        who_should_attend: ["Electric Technicians", "Contractors", "Maintenance engineers", "All Practicing Electric Engineers", "Governmental sector employees"]
                    },
                    {
                        title: "Environmental Law",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "Introduction to global environmental problems and international environmental law. An overview of environmental regulations in Kuwait, impact of resources to the environment and challenges faced by environmental law.",
                        outline: [
                            "Day 1: The Industrial Revolution, Global Environmental Problems",
                            "Day 2: Environmental Externalities, The precautionary principle, Human-Nature Boundary, Regulation the economics of the energy sector, Sustainable Development",
                            "Day 3: History of environmental international cooperation, International environmental politics",
                            "Day 4: Pre-Oil Environmental Laws in Kuwait, Post-Oil Environmental Laws in Kuwait",
                            "Day 5: General Environmental Law Challenges"
                        ],
                        who_should_attend: ["Design Engineers", "Civil Engineers", "Architects", "Environmental Engineers", "Environmentalists", "Governmental sector employees"]
                    },
                    {
                        title: "Finite Element Analysis Applications in Structural Engineering",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course introduces the attendee to the concept of numerical methods, specifically the finite element method, as a detailed analysis method for structures. Utilizing state of the art software packages for finite element analysis of concrete members, the attendee will learn how to model, setup and analyze the concrete members.",
                        outline: [
                            "Day 1: Introduction to finite elements method for solving governing problems, Simple solution for using finite elements with different shape function orders",
                            "Day 2: Processing using FE software to setup reinforced concrete element geometry, Non-linear behavior",
                            "Day 3: Defining different boundary conditions and load conditions including contact conditions, Non-linear problems including large deformation",
                            "Day 4: Post-processing of results and plots, Analysis and testing of results",
                            "Day 5: Introduction of multi-element modeling for large structures, Dynamic analysis of structures for more advanced cases (earthquake, settlement, creep, etc.)"
                        ],
                        who_should_attend: ["Structural Engineers", "Forensic Specialists and Consultants", "Engineering Students", "Graduate Students in Engineering"]
                    },
                    {
                        title: "Introduction to SimSolid | ALTAIR",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "Introduction to CAD/CAM design simulation and benefits. Introduction to SimSolid’s unique performance technology through elimination of geometry simplification and meshing. Simulate multiple design scenarios under real life conditions. Show efficiency of software to solve structural analyses within minutes.",
                        outline: [
                            "Day 1: Introduction to CAD/CAM geometry, Introduction & scope of SimSolid simulation analysis, User interface",
                            "Day 2: Geometry selection, Connections",
                            "Day 3: Load and boundary conditions, Structural linear analysis, Modal analysis",
                            "Day 4: Dynamic analysis, Thermal analysis, Structural non-linear analysis",
                            "Day 5: Design studies, Post-processing, Practice work examples"
                        ],
                        who_should_attend: ["Design Engineers", "Product Designers", "Architects", "Mechanical Engineers", "University Students", "Technical Support"]
                    },
                    {
                        title: "How to Perform an Environmental Impact Assessment (EIA)",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course has been designed to accommodate individuals working in the fields of environment. Learn how to perform a thorough environmental impact assessment for any project with applications.",
                        outline: [
                            "Day 1: Introduction and overview, Laws, policies, and institutional arrangements for EIA, Systems, Public involvement",
                            "Day 2: Screening, Scoping",
                            "Day 3: Mitigation and impact management, Review of EIA quality",
                            "Day 4: Decision making, Implementation and follow-up, EIA project management",
                            "Day 5: Social impact assessment, Strategic environmental assessment, Future direction"
                        ],
                        who_should_attend: ["Design Engineers", "Environmentalists", "Architects", "Civil / Environmental Engineers", "Governmental sector employees", "University students"]
                    },
                    {
                        title: "Introduction to Basic HVAC Systems Fundamentals",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course introduces the fundamentals of heating, ventilation and air conditioning systems.",
                        outline: [
                            "Day 1: Introduction to HVAC systems, Thermal comfort, Psychrometrics",
                            "Day 2: Heating systems, Cooling systems",
                            "Day 3: Ventilation systems, Air distribution systems",
                            "Day 4: HVAC system components, System controls",
                            "Day 5: Operation and maintenance of HVAC systems, Energy efficiency considerations"
                        ],
                        who_should_attend: ["Mechanical Engineers", "HVAC Technicians", "Design Engineers", "Maintenance Engineers", "University Students"]
                    },
                    {
                        title: "Computational Fluid Dynamics Modeling",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "Introduction to CFD and its engineering applications.",
                        outline: [
                            "Day 1: Introduction to CFD, Governing equations of fluid flow",
                            "Day 2: Discretization methods, Mesh generation",
                            "Day 3: Boundary conditions, Turbulence modeling",
                            "Day 4: Heat transfer modeling, Multiphase flow",
                            "Day 5: Post-processing of CFD results, Case studies"
                        ],
                        who_should_attend: ["Mechanical Engineers", "Design Engineers", "Researchers", "Graduate Students", "University Students"]
                    },
                    {
                        title: "Introduction to Detailed Modeling in HVAC",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "High-level simulation of HVAC systems, focusing on energy modeling, indoor air quality (IAQ), and thermal comfort.",
                        outline: [
                            "Day 1: Overview of HVAC modeling, Modeling approaches and assumptions",
                            "Day 2: Load calculations, System sizing",
                            "Day 3: Detailed component modeling, Energy analysis",
                            "Day 4: Simulation tools and techniques, Model validation",
                            "Day 5: Case studies, Best practices in HVAC modeling"
                        ],
                        who_should_attend: ["Mechanical Engineers", "HVAC Designers", "Energy Analysts", "Graduate Students", "University Students"]
                    },
                    {
                        title: "Life Cycle Assessment for Environmental Systems and Devices",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "Training on assessing environmental impacts associated with all stages of a product's life from cradle to grave.",
                        outline: [
                            "Day 1: Introduction to life cycle assessment, Goal and scope definition",
                            "Day 2: Life cycle inventory analysis, Data collection",
                            "Day 3: Life cycle impact assessment, Interpretation of results",
                            "Day 4: Applications of LCA in environmental systems, Case studies",
                            "Day 5: LCA software tools, Reporting and decision making"
                        ],
                        who_should_attend: ["Environmental Engineers", "Sustainability Professionals", "Design Engineers", "Researchers", "University Students"]
                    },
                    {
                        title: "MATLAB Fundamental",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course introduces the fundamentals of MATLAB for engineering and scientific applications. Participants will learn basic programming concepts, data analysis techniques and visualization tools using MATLAB.",
                        outline: [
                            "Day 1: Introduction to MATLAB environment, Basic programming concepts",
                            "Day 2: Data types and variables, Control structures",
                            "Day 3: Functions and scripts, Data analysis techniques",
                            "Day 4: Data visualization, Plotting techniques",
                            "Day 5: Practical applications, Case studies"
                        ],
                        who_should_attend: ["Engineers", "Researchers", "Graduate Students", "University Students", "Professionals seeking MATLAB skills"]
                    },
                    {
                        title: "Geotechnical System Simulation & Modeling",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course introduces geotechnical system simulation and modeling techniques used in civil and geotechnical engineering. Participants will learn how to model soil behavior, foundation systems and geotechnical structures using numerical simulation tools.",
                        outline: [
                            "Day 1: Introduction to geotechnical engineering, Soil properties and classification",
                            "Day 2: Soil behavior modeling, Constitutive models",
                            "Day 3: Foundation system modeling, Slope stability analysis",
                            "Day 4: Numerical simulation tools, Case studies",
                            "Day 5: Advanced geotechnical modeling, Practical applications"
                        ],
                        who_should_attend: ["Geotechnical Engineers", "Civil Engineers", "Design Engineers", "Graduate Students", "University Students"]
                    },
                    {
                        title: "Minitab Fundamental",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course introduces the fundamentals of Minitab for statistical analysis and quality improvement. Participants will learn how to use Minitab for data analysis, hypothesis testing and process improvement.",
                        outline: [
                            "Day 1: Introduction to Minitab, Basic statistics",
                            "Day 2: Data analysis, Graphical tools",
                            "Day 3: Hypothesis testing, Confidence intervals",
                            "Day 4: Regression analysis, ANOVA",
                            "Day 5: Quality improvement tools, Case studies"
                        ],
                        who_should_attend: ["Engineers", "Quality Engineers", "Researchers", "Graduate Students", "University Students"]
                    },
                    {
                        title: "Operation Protection and Maintenance of Electric Machines",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course provides knowledge on the operation, protection and maintenance of electric machines. Participants will learn about different types of electric machines, protection systems and maintenance practices used in industrial applications.",
                        outline: [
                            "Day 1: Introduction to electric machines, Types of electric machines",
                            "Day 2: Operating principles, Performance characteristics",
                            "Day 3: Protection systems, Fault analysis",
                            "Day 4: Maintenance techniques, Condition monitoring",
                            "Day 5: Troubleshooting, Case studies"
                        ],
                        who_should_attend: ["Electrical Engineers", "Maintenance Engineers", "Technicians", "Industrial Professionals", "University Students"]
                    },
                    {
                        title: "Selection and Installation of Electric Cables",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course provides knowledge on selection criteria and installation practices of electric cables. Participants will learn about cable types, sizing, installation methods and safety considerations for electrical systems.",
                        outline: [
                            "Day 1: Introduction to electric cables, Cable types and standards",
                            "Day 2: Cable sizing and selection, Current carrying capacity",
                            "Day 3: Installation methods, Cable routing",
                            "Day 4: Protection and safety, Testing and commissioning",
                            "Day 5: Maintenance practices, Practical examples"
                        ],
                        who_should_attend: ["Electrical Engineers", "Electricians", "Contractors", "Maintenance Engineers", "University Students"]
                    },
                    {
                        title: "SolidWorks – Level 1",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course introduces the fundamentals of SolidWorks for 3D modeling and design. Participants will learn how to create parts, assemblies and drawings using SolidWorks software.",
                        outline: [
                            "Day 1: Introduction to SolidWorks interface, Sketching fundamentals",
                            "Day 2: Part modeling techniques, Feature creation",
                            "Day 3: Assembly modeling, Mates and constraints",
                            "Day 4: Drawing creation, Dimensioning and annotations",
                            "Day 5: Practice projects, Design best practices"
                        ],
                        who_should_attend: ["Mechanical Engineers", "Design Engineers", "Product Designers", "Engineering Students", "University Students"]
                    },
                    {
                        title: "Variable Frequency Drives and DC Motors",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course provides knowledge on variable frequency drives (VFDs) and DC motors. Participants will learn about speed control methods, operation principles and applications of VFDs and DC motors in industrial systems.",
                        outline: [
                            "Day 1: Introduction to VFDs, Basic concepts of motor control",
                            "Day 2: DC motor types, Operating principles",
                            "Day 3: Speed control techniques, Drive components",
                            "Day 4: Applications of VFDs, Energy efficiency considerations",
                            "Day 5: Troubleshooting, Practical case studies"
                        ],
                        who_should_attend: ["Electrical Engineers", "Automation Engineers", "Maintenance Engineers", "Technicians", "University Students"]
                    }
                ]
            },
            impact: {
                title: "Business Impact",
                outcomes: ["Internal Capability", "Certified Workforce", "Software ROI", "Team Productivity"]
            },
            cta: {
                title: "Not sure which training fits your needs?",
                text: "Discuss your team's specific requirements with our training coordinators.",
                button: "Request Training Consultation",
            }
        },
        ar: {
            head: {
                title: "التدريب المعتمد",
                subtitle: "تدريب محاكاة عالي الدقة لتمكين الفرق الهندسية بمهارات عملية معتمدة.",
            },
            institute_info: {
                name: "معهد الكويت للتدريب والمحاكاة الهندسية (KITES)",
                address: "ص.ب. 202، السرة، 45703، الكويت",
                phone: "+965 94738558"
            },
            overview: {
                title: "ملخص تنفيذي",
                content: "برامج المحاكاة قوية بقدر قوة المهندس الذي يستخدمها. نحن نسد فجوة المهارات الحرجة من خلال توفير مناهج تدريبية رسمية متوافقة مع معايير الآيزو (ISO). من النمذجة الفيزيائية الأساسية إلى منهجيات التدقيق المتقدمة، تزود دوراتنا فريقك بالخبرة العملية اللازمة لدفع الابتكار والامتثال داخليًا.",
                quote: "سد فجوة المهارات من خلال تزويد فريقك بخبرات محاكاة معتمدة.",
            },
            courses: {
                title: "كتالوج الدورات التدريبية",
                items: [
                    {
                        title: "Assessment and Design of Environmental Management Systems",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "The course provides insight on designing an EMS and assessing current EMS for various industries. Individuals will learn the skills of how to design and implement an environmental management system and be introduced to various methodologies used within the sustainability work frame to develop and improve environmental management programs. The course familiarizes individuals with ISO guidelines and procedures for an EMS to minimize risks from environmental calamities.",
                        outline: [
                            "Day 1: Introduction to environmental management systems (EMS), Economic impact of EMS, Implementation of EMS, Principles of EMS risk management",
                            "Day 2: Planning and identifying environmental aspects, EMS standards, Guide to ISO standards, EMS implementation, Difference between EMS and ISO",
                            "Day 3: Planning an Environmental Policy, Requirements for ISO and EMS, Setting objectives and targets",
                            "Day 4: Auditing skills, Developing an EMS, Project management for developing EMS, Types of audits, Audit approaches, Audit objectives, scope, and criteria, Audit competence, principles, and methodology, Program roles and responsibilities",
                            "Day 5: Developing an environmental audit program, Monitoring and measuring, Corrective actions, Management review, EMS documentation"
                        ],
                        who_should_attend: ["Design Engineers", "Environmentalists", "Architects", "Civil / Environmental Engineers", "Governmental sector employees", "University students"],
                        standards: "ISO 14001 – Environmental Management System"
                    },
                    {
                        title: "Electric Wiring and Lighting for Residentials and Commercial Buildings",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "Introduction of specialized functions for specialized data analysis with various examples. Gain knowledge of electric wiring and lighting for residential and commercial buildings. Get exposed to methods for the design, installation, protection and analysis of various types of electric wiring and lighting. Employ computer simulation software to solve practical case studies.",
                        outline: [
                            "Day 1: Introduction to Electric Machinery and Drives I",
                            "Day 2: Introduction to LabVIEW, Building Virtual Instruments (VI), Using Data Acquisition (DAQ) Cards",
                            "Day 3: Electric Machinery and Drives II",
                            "Day 4: Workshop 1: Applications and Control of Electric Drives using LabVIEW",
                            "Day 5: Workshop 2: Applications and Control of Electric Drives using LabVIEW"
                        ],
                        who_should_attend: ["Electric Technicians", "Contractors", "Maintenance engineers", "All Practicing Electric Engineers", "Governmental sector employees"]
                    },
                    {
                        title: "Environmental Law",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "Introduction to global environmental problems and international environmental law. An overview of environmental regulations in Kuwait, impact of resources to the environment and challenges faced by environmental law.",
                        outline: [
                            "Day 1: The Industrial Revolution, Global Environmental Problems",
                            "Day 2: Environmental Externalities, The precautionary principle, Human-Nature Boundary, Regulation the economics of the energy sector, Sustainable Development",
                            "Day 3: History of environmental international cooperation, International environmental politics",
                            "Day 4: Pre-Oil Environmental Laws in Kuwait, Post-Oil Environmental Laws in Kuwait",
                            "Day 5: General Environmental Law Challenges"
                        ],
                        who_should_attend: ["Design Engineers", "Civil Engineers", "Architects", "Environmental Engineers", "Environmentalists", "Governmental sector employees"]
                    },
                    {
                        title: "Finite Element Analysis Applications in Structural Engineering",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course introduces the attendee to the concept of numerical methods, specifically the finite element method, as a detailed analysis method for structures. Utilizing state of the art software packages for finite element analysis of concrete members, the attendee will learn how to model, setup and analyze the concrete members.",
                        outline: [
                            "Day 1: Introduction to finite elements method for solving governing problems, Simple solution for using finite elements with different shape function orders",
                            "Day 2: Processing using FE software to setup reinforced concrete element geometry, Non-linear behavior",
                            "Day 3: Defining different boundary conditions and load conditions including contact conditions, Non-linear problems including large deformation",
                            "Day 4: Post-processing of results and plots, Analysis and testing of results",
                            "Day 5: Introduction of multi-element modeling for large structures, Dynamic analysis of structures for more advanced cases (earthquake, settlement, creep, etc.)"
                        ],
                        who_should_attend: ["Structural Engineers", "Forensic Specialists and Consultants", "Engineering Students", "Graduate Students in Engineering"]
                    },
                    {
                        title: "Introduction to SimSolid | ALTAIR",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "Introduction to CAD/CAM design simulation and benefits. Introduction to SimSolid’s unique performance technology through elimination of geometry simplification and meshing. Simulate multiple design scenarios under real life conditions. Show efficiency of software to solve structural analyses within minutes.",
                        outline: [
                            "Day 1: Introduction to CAD/CAM geometry, Introduction & scope of SimSolid simulation analysis, User interface",
                            "Day 2: Geometry selection, Connections",
                            "Day 3: Load and boundary conditions, Structural linear analysis, Modal analysis",
                            "Day 4: Dynamic analysis, Thermal analysis, Structural non-linear analysis",
                            "Day 5: Design studies, Post-processing, Practice work examples"
                        ],
                        who_should_attend: ["Design Engineers", "Product Designers", "Architects", "Mechanical Engineers", "University Students", "Technical Support"]
                    },
                    {
                        title: "How to Perform an Environmental Impact Assessment (EIA)",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course has been designed to accommodate individuals working in the fields of environment. Learn how to perform a thorough environmental impact assessment for any project with applications.",
                        outline: [
                            "Day 1: Introduction and overview, Laws, policies, and institutional arrangements for EIA, Systems, Public involvement",
                            "Day 2: Screening, Scoping",
                            "Day 3: Mitigation and impact management, Review of EIA quality",
                            "Day 4: Decision making, Implementation and follow-up, EIA project management",
                            "Day 5: Social impact assessment, Strategic environmental assessment, Future direction"
                        ],
                        who_should_attend: ["Design Engineers", "Environmentalists", "Architects", "Civil / Environmental Engineers", "Governmental sector employees", "University students"]
                    },
                    {
                        title: "Introduction to Basic HVAC Systems Fundamentals",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course introduces the fundamentals of heating, ventilation and air conditioning systems.",
                        outline: [
                            "Day 1: Introduction to HVAC systems, Thermal comfort, Psychrometrics",
                            "Day 2: Heating systems, Cooling systems",
                            "Day 3: Ventilation systems, Air distribution systems",
                            "Day 4: HVAC system components, System controls",
                            "Day 5: Operation and maintenance of HVAC systems, Energy efficiency considerations"
                        ],
                        who_should_attend: ["Mechanical Engineers", "HVAC Technicians", "Design Engineers", "Maintenance Engineers", "University Students"]
                    },
                    {
                        title: "Computational Fluid Dynamics Modeling",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "Introduction to CFD and its engineering applications.",
                        outline: [
                            "Day 1: Introduction to CFD, Governing equations of fluid flow",
                            "Day 2: Discretization methods, Mesh generation",
                            "Day 3: Boundary conditions, Turbulence modeling",
                            "Day 4: Heat transfer modeling, Multiphase flow",
                            "Day 5: Post-processing of CFD results, Case studies"
                        ],
                        who_should_attend: ["Mechanical Engineers", "Design Engineers", "Researchers", "Graduate Students", "University Students"]
                    },
                    {
                        title: "Introduction to Detailed Modeling in HVAC",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "High-level simulation of HVAC systems, focusing on energy modeling, indoor air quality (IAQ), and thermal comfort.",
                        outline: [
                            "Day 1: Overview of HVAC modeling, Modeling approaches and assumptions",
                            "Day 2: Load calculations, System sizing",
                            "Day 3: Detailed component modeling, Energy analysis",
                            "Day 4: Simulation tools and techniques, Model validation",
                            "Day 5: Case studies, Best practices in HVAC modeling"
                        ],
                        who_should_attend: ["Mechanical Engineers", "HVAC Designers", "Energy Analysts", "Graduate Students", "University Students"]
                    },
                    {
                        title: "Life Cycle Assessment for Environmental Systems and Devices",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "Training on assessing environmental impacts associated with all stages of a product's life from cradle to grave.",
                        outline: [
                            "Day 1: Introduction to life cycle assessment, Goal and scope definition",
                            "Day 2: Life cycle inventory analysis, Data collection",
                            "Day 3: Life cycle impact assessment, Interpretation of results",
                            "Day 4: Applications of LCA in environmental systems, Case studies",
                            "Day 5: LCA software tools, Reporting and decision making"
                        ],
                        who_should_attend: ["Environmental Engineers", "Sustainability Professionals", "Design Engineers", "Researchers", "University Students"]
                    },
                    {
                        title: "MATLAB Fundamental",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course introduces the fundamentals of MATLAB for engineering and scientific applications. Participants will learn basic programming concepts, data analysis techniques and visualization tools using MATLAB.",
                        outline: [
                            "Day 1: Introduction to MATLAB environment, Basic programming concepts",
                            "Day 2: Data types and variables, Control structures",
                            "Day 3: Functions and scripts, Data analysis techniques",
                            "Day 4: Data visualization, Plotting techniques",
                            "Day 5: Practical applications, Case studies"
                        ],
                        who_should_attend: ["Engineers", "Researchers", "Graduate Students", "University Students", "Professionals seeking MATLAB skills"]
                    },
                    {
                        title: "Geotechnical System Simulation & Modeling",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course introduces geotechnical system simulation and modeling techniques used in civil and geotechnical engineering. Participants will learn how to model soil behavior, foundation systems and geotechnical structures using numerical simulation tools.",
                        outline: [
                            "Day 1: Introduction to geotechnical engineering, Soil properties and classification",
                            "Day 2: Soil behavior modeling, Constitutive models",
                            "Day 3: Foundation system modeling, Slope stability analysis",
                            "Day 4: Numerical simulation tools, Case studies",
                            "Day 5: Advanced geotechnical modeling, Practical applications"
                        ],
                        who_should_attend: ["Geotechnical Engineers", "Civil Engineers", "Design Engineers", "Graduate Students", "University Students"]
                    },
                    {
                        title: "Minitab Fundamental",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course introduces the fundamentals of Minitab for statistical analysis and quality improvement. Participants will learn how to use Minitab for data analysis, hypothesis testing and process improvement.",
                        outline: [
                            "Day 1: Introduction to Minitab, Basic statistics",
                            "Day 2: Data analysis, Graphical tools",
                            "Day 3: Hypothesis testing, Confidence intervals",
                            "Day 4: Regression analysis, ANOVA",
                            "Day 5: Quality improvement tools, Case studies"
                        ],
                        who_should_attend: ["Engineers", "Quality Engineers", "Researchers", "Graduate Students", "University Students"]
                    },
                    {
                        title: "Operation Protection and Maintenance of Electric Machines",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course provides knowledge on the operation, protection and maintenance of electric machines. Participants will learn about different types of electric machines, protection systems and maintenance practices used in industrial applications.",
                        outline: [
                            "Day 1: Introduction to electric machines, Types of electric machines",
                            "Day 2: Operating principles, Performance characteristics",
                            "Day 3: Protection systems, Fault analysis",
                            "Day 4: Maintenance techniques, Condition monitoring",
                            "Day 5: Troubleshooting, Case studies"
                        ],
                        who_should_attend: ["Electrical Engineers", "Maintenance Engineers", "Technicians", "Industrial Professionals", "University Students"]
                    },
                    {
                        title: "Selection and Installation of Electric Cables",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course provides knowledge on selection criteria and installation practices of electric cables. Participants will learn about cable types, sizing, installation methods and safety considerations for electrical systems.",
                        outline: [
                            "Day 1: Introduction to electric cables, Cable types and standards",
                            "Day 2: Cable sizing and selection, Current carrying capacity",
                            "Day 3: Installation methods, Cable routing",
                            "Day 4: Protection and safety, Testing and commissioning",
                            "Day 5: Maintenance practices, Practical examples"
                        ],
                        who_should_attend: ["Electrical Engineers", "Electricians", "Contractors", "Maintenance Engineers", "University Students"]
                    },
                    {
                        title: "SolidWorks – Level 1",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course introduces the fundamentals of SolidWorks for 3D modeling and design. Participants will learn how to create parts, assemblies and drawings using SolidWorks software.",
                        outline: [
                            "Day 1: Introduction to SolidWorks interface, Sketching fundamentals",
                            "Day 2: Part modeling techniques, Feature creation",
                            "Day 3: Assembly modeling, Mates and constraints",
                            "Day 4: Drawing creation, Dimensioning and annotations",
                            "Day 5: Practice projects, Design best practices"
                        ],
                        who_should_attend: ["Mechanical Engineers", "Design Engineers", "Product Designers", "Engineering Students", "University Students"]
                    },
                    {
                        title: "Variable Frequency Drives and DC Motors",
                        duration: "Days: 5 | Hrs: 20 | 4 HRS/DAY",
                        desc: "This course provides knowledge on variable frequency drives (VFDs) and DC motors. Participants will learn about speed control methods, operation principles and applications of VFDs and DC motors in industrial systems.",
                        outline: [
                            "Day 1: Introduction to VFDs, Basic concepts of motor control",
                            "Day 2: DC motor types, Operating principles",
                            "Day 3: Speed control techniques, Drive components",
                            "Day 4: Applications of VFDs, Energy efficiency considerations",
                            "Day 5: Troubleshooting, Practical case studies"
                        ],
                        who_should_attend: ["Electrical Engineers", "Automation Engineers", "Maintenance Engineers", "Technicians", "University Students"]
                    }
                ]
            },
            // Note: Keeping generic delivery for AR for now as translation wasn't provided for all 17 courses in the prompt.
            // Using the legacy content structure fallback for AR.
            delivery: {
                title: "كيف نقدم الخدمة",
                steps: [
                    "ورش عمل محلية عملية",
                    "منهج ANSYS الرسمي",
                    "توجيه قائم على المشاريع",
                    "امتحانات الشهادات",
                    "تدريب مخصص للفرق"
                ],
            },
            impact: {
                title: "تأثير الأعمال",
                outcomes: ["قدرات داخلية", "قوى عاملة معتمدة", "عائد استثمار البرمجيات", "إنتاجية الفريق"]
            },
            cta: {
                title: "لست متأكداً أي تدريب يناسب احتياجاتك؟",
                text: "ناقش المتطلبات الخاصة لفريقك مع منسقي التدريب لدينا.",
                button: "اطلب استشارة تدريبية",
            }
        }
    },
    "software-distribution": {
        id: "software-distribution",
        icon: Leaf,
        en: {
            head: {
                title: "Software Distribution",
                subtitle: "Access world-class simulation platforms with local support.",
            },
            overview: {
                title: "What This Service Solves",
                content: "Acquiring and maintaining engineering software can be complex. We simplify the process by handling licensing, deployment, and technical infrastructure support for the world's leading simulation platforms.",
                quote: "Access and integrate the world's leading simulation platforms seamlessly.",
            },
            partners: {
                title: "Our Technology Partners",
                items: [
                    { name: "Dassault Systèmes", desc: "World leader in 3D design & engineering software.", logo: dassaultLogo, color: "#005686" },
                    { name: "SOLIDWORKS", desc: "Premier 3D CAD design and engineering capabilities.", logo: solidworksLogo, color: "#E92A2E" },
                    { name: "SIMULIA", desc: "Realistic simulation applications (Abaqus, fe-safe).", logo: simuliaLogo, color: "#005686" },
                    { name: "MSC Software", desc: "Leading multi-physics and CAE simulation solutions.", logo: mscLogo, color: "#FFD100" },
                    { name: "CYPE", desc: "Software for architecture, engineering and construction.", logo: cypeLogo, color: "#00AEEF" },
                    { name: "SimLab Soft", desc: "3D visualization and VR collaboration tools.", logo: simlabLogo, color: "#F37021" },
                    { name: "DriveWorks", desc: "Design automation and CPQ for SOLIDWORKS.", logo: driveworksLogo, color: "#8CC63F" },
                    { name: "CHAOS", desc: "High-quality rendering and visualization technology.", logo: chaosLogo, color: "#ffffff" },
                    { name: "SimaPro", desc: "Leading LCA software for sustainability analysis.", logo: simaproLogo, color: "#78BE20" },
                    { name: "MAXQDA", desc: "Advanced qualitative and mixed methods data analysis.", logo: maxqdaLogo, color: "#009EE3" },
                    { name: "CREALITY", desc: "Professional 3D printing and additive manufacturing.", logo: crealityLogo, color: "#00CC00" },
                    { name: "HEROWEAR", desc: "Exosuits for workforce safety and fatigue reduction.", logo: herowearLogo, color: "#F15A29" }
                ]
            },
            features: {
                title: "Why Choose KITES?",
                items: [
                    { title: "Official Distributor", desc: "Direct partnership ensuring authentic licenses and best pricing." },
                    { title: "Local Support", desc: "Same-time-zone technical support from certified engineers." },
                    { title: "Turnkey Setup", desc: "We handle installation, server configuration, and license server management." },
                    { title: "Training Included", desc: "Complementary orientation sessions for your team." }
                ]
            },
            delivery: {
                title: "Deployment Process",
                steps: [
                    "Needs Assessment & Sizing",
                    "License Procurement",
                    "Server & Client Installation",
                    "Configuration & Testing",
                    "User Onboarding"
                ],
            },
            impact: {
                title: "Business Impact",
                outcomes: ["Seamless Access", "Technical Support", "Scalable Licensing", "Operational Continuity"]
            },
            cta: {
                text: "Looking for the right software solution?",
                button: "Request a Quote",
            }
        },
        ar: {
            head: {
                title: "توزيع البرمجيات",
                subtitle: "الوصول إلى منصات محاكاة عالمية المستوى مع دعم محلي.",
            },
            overview: {
                title: "ما تقدمه هذه الخدمة",
                content: "يمكن أن يكون الحصول على البرمجيات الهندسية وصيانتها أمرًا معقدًا. نحن نبسط العملية من خلال التعامل مع الترخيص والنشر ودعم البنية التحتية الفنية لمنصات المحاكاة الرائدة في العالم.",
                quote: "الوصول إلى منصات المحاكاة الرائدة عالمياً ودمجها بسلاسة.",
            },
            partners: {
                title: "شركاؤنا التكنولوجيون",
                items: [
                    { name: "Dassault Systèmes", desc: "الرائدة عالمياً في برامج التصميم والهندسة ثلاثية الأبعاد.", logo: dassaultLogo, color: "#005686" },
                    { name: "SOLIDWORKS", desc: "قدرات تصميم وهندسة CAD ثلاثية الأبعاد رائدة.", logo: solidworksLogo, color: "#E92A2E" },
                    { name: "SIMULIA", desc: "تطبيقات المحاكاة الواقعية (Abaqus, fe-safe).", logo: simuliaLogo, color: "#005686" },
                    { name: "MSC Software", desc: "حلول محاكاة الفيزياء المتعددة وCAE الرائدة.", logo: mscLogo, color: "#FFD100" },
                    { name: "CYPE", desc: "برمجيات للهندسة المعمارية والهندسة والبناء.", logo: cypeLogo, color: "#00AEEF" },
                    { name: "SimLab Soft", desc: "أدوات التصور ثلاثي الأبعاد والتعاون عبر الواقع الافتراضي.", logo: simlabLogo, color: "#F37021" },
                    { name: "DriveWorks", desc: "أتمتة التصميم وCPQ لبرنامج SOLIDWORKS.", logo: driveworksLogo, color: "#8CC63F" },
                    { name: "CHAOS", desc: "تكنولوجيا التصيير والتصور عالية الجودة.", logo: chaosLogo, color: "#ffffff" },
                    { name: "SimaPro", desc: "برنامج LCA الرائد لتحليل الاستدامة.", logo: simaproLogo, color: "#78BE20" },
                    { name: "MAXQDA", desc: "تحليل بيانات الطرق النوعية والمختلطة المتقدمة.", logo: maxqdaLogo, color: "#009EE3" },
                    { name: "CREALITY", desc: "الطباعة ثلاثية الأبعاد الاحترافية والتصنيع الإضافي.", logo: crealityLogo, color: "#00CC00" },
                    { name: "HEROWEAR", desc: "بدلات خارجية لسلامة القوى العاملة وتقليل التعب.", logo: herowearLogo, color: "#F15A29" }
                ]
            },
            features: {
                title: "لماذا تختار KITES؟",
                items: [
                    { title: "موزع رسمي", desc: "شراكة مباشرة تضمن تراخيص أصلية وأفضل الأسعار." },
                    { title: "دعم محلي", desc: "دعم فني في نفس المنطقة الزمنية من مهندسين معتمدين." },
                    { title: "إعداد متكامل", desc: "نتولى التثبيت وتكوين الخادم وإدارة خادم الترخيص." },
                    { title: "تدريب شامل", desc: "جلسات توجيهية تكميلية لفريقك." }
                ]
            },
            delivery: {
                title: "عملية النشر",
                steps: [
                    "تقييم الاحتياجات وتحديد الحجم",
                    "شراء التراخيص",
                    "تثبيت الخادم والعميل",
                    "التكوين والاختبار",
                    "تأهيل المستخدمين"
                ],
            },
            impact: {
                title: "تأثير الأعمال",
                outcomes: ["وصول سلس", "دعم فني", "ترخيص قابل للتوسع", "استمرارية التشغيل"]
            },
            cta: {
                text: "هل تبحث عن الحل البرمجي المناسب؟",
                button: "اطلب عرض سعر",
            }
        }
    },
    "environmental-consulting": {
        id: "environmental-consulting",
        icon: Leaf,
        en: {
            head: {
                title: "Environmental Consulting",
                subtitle: "Comprehensive environmental solutions ensuring sustainability and regulatory compliance for complex industrial projects.",
            },
            overview: {
                title: "Sustainable Development Partners",
                content: "We provide specialized environmental consulting services designed to balance industrial growth with ecological preservation. From rigorous Environmental Impact Assessments (EIA) to Carbon Footprint analysis, our expert team utilizes advanced simulation and regulatory knowledge to guide your projects toward full compliance and environmental stewardship.",
                quote: "Balancing industrial growth with ecological preservation through data-driven environmental strategies.",
            },
            delivery: {
                title: "Our Services",
                steps: [
                    "Environmental Impact Assessment (EIA)",
                    "Environmental Social Impact Assessment (ESIA)",
                    "Strategic Environmental Assessment (SEA)",
                    "Environmental Management Systems (EMS - ISO 14001)",
                    "Pollution Modeling & Control"
                ],
            },
            impact: {
                title: "Business Impact",
                outcomes: ["Regulatory Approval", "Operational Sustainability", "Risk Mitigation", "Community Trust"]
            },
            cta: {
                text: "Ready to ensure your project's sustainability?",
                button: "Request Environmental Consult",
            }
        },
        ar: {
            head: {
                title: "الاستشارات البيئية",
                subtitle: "حلول بيئية شاملة تضمن الاستدامة والامتثال التنظيمي للمشاريع الصناعية المعقدة.",
            },
            overview: {
                title: "شركاء التنمية المستدامة",
                content: "نقدم خدمات استشارية بيئية متخصصة مصممة للموازنة بين النمو الصناعي والحفاظ على البيئة. من تقييمات الأثر البيئي الصارمة (EIA) إلى تحليل البصمة الكربونية، يستخدم فريق خبرائنا المحاكاة المتقدمة والمعرفة التنظيمية لتوجيه مشاريعك نحو الامتثال الكامل والريادة البيئية.",
                quote: "الموازنة بين النمو الصناعي والحفاظ على البيئة من خلال استراتيجيات بيئية تعتمد على البيانات.",
            },
            delivery: {
                title: "خدماتنا",
                steps: [
                    "تقييم الأثر البيئي (EIA)",
                    "تقييم الأثر البيئي والاجتماعي (ESIA)",
                    "التقييم البيئي الاستراتيجي (SEA)",
                    "نظم الإدارة البيئية (EMS - ISO 14001)",
                    "نمذجة ومكافحة التلوث"
                ],
            },
            impact: {
                title: "تأثير الأعمال",
                outcomes: ["الموافقة التنظيمية", "الاستدامة التشغيلية", "تخفيف المخاطر", "ثقة المجتمع"]
            },
            cta: {
                text: "هل أنت مستعد لضمان استدامة مشروعك؟",
                button: "اطلب استشارة بيئية",
            }
        }
    }
};
