export interface Testimonial {
    id: string;
    clientName: {
        en: string;
        ar: string;
    };
    clientTitle: {
        en: string;
        ar: string;
    };
    company: {
        en: string;
        ar: string;
    };
    quote: {
        en: string;
        ar: string;
    };
    photo: string;
    companyLogo?: string;
    rating: number; // 1-5
    location?: {
        en: string;
        ar: string;
    };
    project?: {
        en: string;
        ar: string;
    };
}

export const testimonials: Testimonial[] = [
    {
        id: "1",
        clientName: {
            en: "Dr. Ahmed Al-Mansouri",
            ar: "د. أحمد المنصوري"
        },
        clientTitle: {
            en: "Director of Engineering",
            ar: "مدير الهندسة"
        },
        company: {
            en: "Saudi Aramco",
            ar: "أرامكو السعودية"
        },
        quote: {
            en: "KITES transformed our simulation capabilities. Their training programs equipped our engineers with cutting-edge skills that directly improved our project outcomes.",
            ar: "حولت كايتس قدراتنا في المحاكاة. برامجهم التدريبية زودت مهندسينا بمهارات متقدمة أثرت مباشرة على نتائج مشاريعنا."
        },
        photo: "/images/testimonials/ahmed-al-mansouri.jpg",
        rating: 5,
        location: {
            en: "Riyadh, Saudi Arabia",
            ar: "الرياض، السعودية"
        },
        project: {
            en: "CFD Simulation Training",
            ar: "تدريب محاكاة ديناميكا الموائع"
        }
    },
    {
        id: "2",
        clientName: {
            en: "Eng. Fatima Al-Qasimi",
            ar: "م. فاطمة القاسمي"
        },
        clientTitle: {
            en: "Head of R&D",
            ar: "رئيسة البحث والتطوير"
        },
        company: {
            en: "ACWA Power",
            ar: "أكوا باور"
        },
        quote: {
            en: "The technical expertise and hands-on support from KITES helped us accelerate our renewable energy projects. Their simulation tools are world-class.",
            ar: "الخبرة الفنية والدعم العملي من كايتس ساعدنا في تسريع مشاريع الطاقة المتجددة. أدوات المحاكاة الخاصة بهم عالمية المستوى."
        },
        photo: "/images/testimonials/fatima-al-qasimi.jpg",
        rating: 5,
        location: {
            en: "Dubai, UAE",
            ar: "دبي، الإمارات"
        },
        project: {
            en: "Renewable Energy Modeling",
            ar: "نمذجة الطاقة المتجددة"
        }
    },
    {
        id: "3",
        clientName: {
            en: "Dr. Mohammed Al-Thani",
            ar: "د. محمد الثاني"
        },
        clientTitle: {
            en: "Professor of Mechanical Engineering",
            ar: "أستاذ الهندسة الميكانيكية"
        },
        company: {
            en: "King Fahd University",
            ar: "جامعة الملك فهد"
        },
        quote: {
            en: "Our partnership with KITES brought advanced simulation capabilities to our research programs. Their consultants are highly knowledgeable and professional.",
            ar: "شراكتنا مع كايتس أضافت قدرات محاكاة متقدمة لبرامجنا البحثية. استشاريوهم ذوو معرفة عالية واحترافية."
        },
        photo: "/images/testimonials/mohammed-al-thani.jpg",
        rating: 5,
        location: {
            en: "Dhahran, Saudi Arabia",
            ar: "الظهران، السعودية"
        },
        project: {
            en: "Academic Partnership",
            ar: "شراكة أكاديمية"
        }
    },
    {
        id: "4",
        clientName: {
            en: "Eng. Khalid Al-Harbi",
            ar: "م. خالد الحربي"
        },
        clientTitle: {
            en: "Project Manager",
            ar: "مدير المشاريع"
        },
        company: {
            en: "Qatar Petroleum",
            ar: "قطر للبترول"
        },
        quote: {
            en: "KITES delivered exceptional structural analysis training. The practical approach and real-world examples made complex concepts easy to understand and apply.",
            ar: "قدمت كايتس تدريباً استثنائياً في التحليل الإنشائي. النهج العملي والأمثلة الواقعية جعلت المفاهيم المعقدة سهلة الفهم والتطبيق."
        },
        photo: "/images/testimonials/khalid-al-harbi.jpg",
        rating: 5,
        location: {
            en: "Doha, Qatar",
            ar: "الدوحة، قطر"
        },
        project: {
            en: "Structural Analysis Training",
            ar: "تدريب التحليل الإنشائي"
        }
    },
    {
        id: "5",
        clientName: {
            en: "Dr. Sara Al-Dosari",
            ar: "د. سارة الدوسري"
        },
        clientTitle: {
            en: "Sustainability Consultant",
            ar: "مستشارة الاستدامة"
        },
        company: {
            en: "NEOM Project",
            ar: "مشروع نيوم"
        },
        quote: {
            en: "Working with KITES on urban planning simulation was transformative. Their innovative approach helped us visualize and optimize sustainable city designs.",
            ar: "العمل مع كايتس على محاكاة التخطيط العمراني كان تحويلياً. نهجهم المبتكر ساعدنا في تصور وتحسين تصاميم المدن المستدامة."
        },
        photo: "/images/testimonials/sara-al-dosari.jpg",
        rating: 5,
        location: {
            en: "NEOM, Saudi Arabia",
            ar: "نيوم، السعودية"
        },
        project: {
            en: "Urban Planning Simulation",
            ar: "محاكاة التخطيط العمراني"
        }
    },
    {
        id: "6",
        clientName: {
            en: "Eng. Omar Al-Shamsi",
            ar: "م. عمر الشامسي"
        },
        clientTitle: {
            en: "Operations Director",
            ar: "مدير العمليات"
        },
        company: {
            en: "SABIC",
            ar: "سابك"
        },
        quote: {
            en: "The process optimization consulting from KITES resulted in significant efficiency gains. Their data-driven approach and expertise are unmatched.",
            ar: "استشارات تحسين العمليات من كايتس أدت إلى مكاسب كبيرة في الكفاءة. نهجهم القائم على البيانات وخبرتهم لا مثيل لها."
        },
        photo: "/images/testimonials/omar-al-shamsi.jpg",
        rating: 5,
        location: {
            en: "Jubail, Saudi Arabia",
            ar: "الجبيل، السعودية"
        },
        project: {
            en: "Process Optimization",
            ar: "تحسين العمليات"
        }
    }
];
