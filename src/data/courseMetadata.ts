// Course image mapping and metadata
export interface CourseMetadata {
    image: string;
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
    rating: number;
    enrollmentCount: number;
    certified: boolean;
    color: string; // Primary accent color
}

export const courseMetadataMap: Record<string, CourseMetadata> = {
    // Environmental Management
    "Assessment and Design of Environmental Management Systems": {
        image: "/assets/training/environmental-management.png",
        category: "Sustainability",
        level: "Professional",
        rating: 4.9,
        enrollmentCount: 850,
        certified: true,
        color: "#10b981" // Green
    },

    // Electrical & Wiring
    "Electric Wiring and Lighting for Residentials and Commercial Buildings": {
        image: "/assets/training/electric-machines.png",
        category: "Electrical",
        level: "Intermediate",
        rating: 4.7,
        enrollmentCount: 620,
        certified: false,
        color: "#f59e0b" // Orange
    },

    // Environmental Law
    "Environmental Law": {
        image: "/assets/training/environmental-law.png",
        category: "Sustainability",
        level: "Professional",
        rating: 4.6,
        enrollmentCount: 450,
        certified: false,
        color: "#10b981" // Green
    },

    // FEA Structural
    "Finite Element Analysis Applications in Structural Engineering": {
        image: "/assets/training/fea-structural.png",
        category: "Simulation",
        level: "Advanced",
        rating: 4.8,
        enrollmentCount: 1200,
        certified: true,
        color: "#8b5cf6" // Purple
    },

    // SimSolid
    "Introduction to SimSolid | ALTAIR": {
        image: "/assets/training/simsolid.png",
        category: "CAD Design",
        level: "Intermediate",
        rating: 4.7,
        enrollmentCount: 780,
        certified: true,
        color: "#3b82f6" // Blue
    },

    // EIA
    "How to Perform an Environmental Impact Assessment (EIA)": {
        image: "/assets/training/eia.png",
        category: "Sustainability",
        level: "Professional",
        rating: 4.8,
        enrollmentCount: 920,
        certified: true,
        color: "#10b981" // Green
    },

    // HVAC Basics
    "Introduction to Basic HVAC Systems Fundamentals": {
        image: "/assets/training/hvac-basics.png",
        category: "MEP Systems",
        level: "Beginner",
        rating: 4.5,
        enrollmentCount: 1450,
        certified: false,
        color: "#f97316" // Orange
    },

    // CFD Modeling
    "Computational Fluid Dynamics Modeling": {
        image: "/assets/training/cfd-modeling.png",
        category: "Fluid Dynamics",
        level: "Advanced",
        rating: 4.9,
        enrollmentCount: 1100,
        certified: true,
        color: "#06b6d4" // Cyan
    },

    // HVAC Detailed
    "Introduction to Detailed Modeling in HVAC": {
        image: "/assets/training/hvac-basics.png",
        category: "MEP Systems",
        level: "Advanced",
        rating: 4.7,
        enrollmentCount: 680,
        certified: true,
        color: "#f97316" // Orange
    },

    // LCA
    "Life Cycle Assessment for Environmental Systems and Devices": {
        image: "/assets/training/eia.png",
        category: "Sustainability",
        level: "Professional",
        rating: 4.8,
        enrollmentCount: 540,
        certified: true,
        color: "#10b981" // Green
    },

    // Additional courses - using placeholder images for now
    "Green Building Rating Systems": {
        image: "/assets/training/environmental-management.png",
        category: "Sustainability",
        level: "Professional",
        rating: 4.7,
        enrollmentCount: 720,
        certified: true,
        color: "#10b981"
    },

    "MATLAB Programming": {
        image: "/assets/training/matlab.png",
        category: "Programming",
        level: "Intermediate",
        rating: 4.6,
        enrollmentCount: 980,
        certified: false,
        color: "#ef4444"
    },

    "Minitab Statistical Analysis": {
        image: "/assets/training/minitab.png",
        category: "Programming",
        level: "Beginner",
        rating: 4.5,
        enrollmentCount: 650,
        certified: false,
        color: "#10b981"
    },

    "Programming with VBA and Macros": {
        image: "/assets/training/vba.png",
        category: "Programming",
        level: "Intermediate",
        rating: 4.4,
        enrollmentCount: 890,
        certified: false,
        color: "#10b981"
    },

    "Electric Machine Winding Design": {
        image: "/assets/training/electric-machines.png",
        category: "Electrical",
        level: "Advanced",
        rating: 4.6,
        enrollmentCount: 430,
        certified: true,
        color: "#f59e0b"
    },

    "Geotechnical Investigation Methods": {
        image: "/assets/training/geotechnical.png",
        category: "Civil Engineering",
        level: "Professional",
        rating: 4.7,
        enrollmentCount: 520,
        certified: true,
        color: "#78716c"
    },

    "Lighting Design Fundamentals": {
        image: "/assets/training/electric-machines.png",
        category: "Electrical",
        level: "Beginner",
        rating: 4.5,
        enrollmentCount: 710,
        certified: false,
        color: "#fbbf24"
    },

    // MATLAB Fundamental (exact title match)
    "MATLAB Fundamental": {
        image: "/assets/training/matlab-fundamental.png",
        category: "Programming",
        level: "Beginner",
        rating: 4.5,
        enrollmentCount: 500,
        certified: false,
        color: "#ef4444"
    },

    // Geotechnical System Simulation & Modeling (exact title match)
    "Geotechnical System Simulation & Modeling": {
        image: "/assets/training/geotechnical.png",
        category: "Simulation",
        level: "Intermediate",
        rating: 4.5,
        enrollmentCount: 500,
        certified: false,
        color: "#8b5cf6"
    },

    // Minitab Fundamental (exact title match)
    "Minitab Fundamental": {
        image: "/assets/training/minitab-statistics.png",
        category: "Programming",
        level: "Beginner",
        rating: 4.5,
        enrollmentCount: 500,
        certified: false,
        color: "#10b981"
    },

    // Operation Protection and Maintenance of Electric Machines
    "Operation Protection and Maintenance of Electric Machines": {
        image: "/assets/training/electric-machines.png",
        category: "Electrical",
        level: "Intermediate",
        rating: 4.5,
        enrollmentCount: 500,
        certified: false,
        color: "#f59e0b"
    },

    // Selection and Installation of Electric Cables
    "Selection and Installation of Electric Cables": {
        image: "/assets/training/electric-machines.png",
        category: "Electrical",
        level: "Intermediate",
        rating: 4.5,
        enrollmentCount: 500,
        certified: false,
        color: "#f59e0b"
    },

    // SolidWorks – Level 1
    "SolidWorks – Level 1": {
        image: "/assets/training/solidworks-level-1.png",
        category: "CAD Design",
        level: "Beginner",
        rating: 4.5,
        enrollmentCount: 500,
        certified: false,
        color: "#3b82f6"
    },

    // Variable Frequency Drives and DC Motors
    "Variable Frequency Drives and DC Motors": {
        image: "/assets/training/electric-machines.png",
        category: "Electrical",
        level: "Intermediate",
        rating: 4.5,
        enrollmentCount: 500,
        certified: false,
        color: "#f59e0b"
    }
};

// Helper function to get metadata for a course
export const getCourseMetadata = (courseTitle: string): CourseMetadata => {
    return courseMetadataMap[courseTitle] || {
        image: "/assets/training/default-course.jpg",
        category: "Other",
        level: "Intermediate",
        rating: 4.5,
        enrollmentCount: 500,
        certified: false,
        color: "#6b7280"
    };
};

// Category color mapping
export const categoryColors: Record<string, string> = {
    "Sustainability": "#10b981",
    "CAD Design": "#3b82f6",
    "Fluid Dynamics": "#06b6d4",
    "Simulation": "#8b5cf6",
    "MEP Systems": "#f97316",
    "Programming": "#ef4444",
    "Electrical": "#f59e0b",
    "Civil Engineering": "#78716c",
    "Other": "#6b7280"
};
