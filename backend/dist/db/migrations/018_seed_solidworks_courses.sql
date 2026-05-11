-- Migration 018: Seed SOLIDWORKS course catalog from official course descriptions
-- Updates existing SolidWorks Level 1, adds 8 new SOLIDWORKS courses

-- Update existing SolidWorks Level 1 with real description
UPDATE courses SET
    title        = 'SOLIDWORKS Level 1',
    short_desc   = 'Foundational 3D parametric modelling over 5 days — includes homework system, printed slides, and final exam.',
    description  = $d$KITES offers a focused and practical training course in SOLIDWORKS designed to build a strong foundation in 3D modeling and parametric design. The course runs over 5 days, with 2 hours of training each day, making it ideal for professionals and students looking to develop their skills within a short timeframe. Throughout the program, participants will learn the core principles of creating and modifying parametric models, supported by hands-on exercises that reinforce each concept. The course includes a series of structured homework assignments and practical projects to ensure real understanding and application of the tools. By the end of the training, participants will have developed essential modeling skills and will receive an official certificate from KITES recognizing their achievement. Additional supplements: HomeWorks System, Printed PowerPoint Slides with Lectures, Final Exam System.$d$,
    category     = 'CAD Design',
    level        = 'Beginner',
    duration     = '5 Days',
    certified    = true,
    color        = '#3b82f6',
    updated_at   = NOW()
WHERE slug = 'solidworks-level-1';

-- Insert the 8 new SOLIDWORKS courses
INSERT INTO courses (title, slug, short_desc, description, category, level, price, status, rating, enrollment_count, certified, color, duration) VALUES

('SOLIDWORKS Level 2',
 'solidworks-level-2',
 'Advanced tools for freeform shapes, multi-body modeling, assemblies, technical drawings, and design configurations.',
 $d$This advanced course is intended for learners who are already comfortable with the fundamentals and are ready to use powerful, often overlooked tools that greatly increase design flexibility and efficiency. You will learn how to build complex, freeform shapes using hidden modeling techniques, such as bending, twisting, and tapering existing geometry, as well as methods for combining solid bodies by uniting, subtracting, or intersecting them. The course also covers advanced handling of multiple solid bodies, including precise repositioning and resizing of parts within a single modeling environment. Beyond individual part creation, the course builds a strong foundation in putting together assemblies, focusing on key constraint techniques to define mechanical relationships and motion between components. Finally, you will learn to produce professional-quality technical drawings with automatically generated views, labels, and dimensioning systems. You will also explore how to manage multiple design variations, like different sizes, materials, or hidden states, within one file, streamlining your workflow from initial concept to final documentation.$d$,
 'CAD Design', 'Intermediate', 0, 'published', 4.7, 0, true, '#3b82f6', NULL),

('SOLIDWORKS Surfaces Modeling',
 'solidworks-surfaces-modeling',
 'High-level surface design for complex organic shapes — from consumer products to automotive and aerospace components.',
 $d$This advanced surface design course provides a thorough exploration of high-level modeling techniques, enabling you to produce complex, organic, and high-quality shapes that are difficult to achieve with standard solid modeling alone. You will learn the essential methods for creating surface geometry, including extruded, revolved, and lofted forms, as well as flat surfaces, while also developing the ability to build precise curved guide lines for smooth transitions and aesthetically pleasing shapes. The curriculum further covers key techniques for refining surfaces, such as projecting edge lines onto faces to support complex patterning or angled geometry, and using visual analysis tools to evaluate smoothness, flow, and curvature quality, ensuring your models are both production-ready and visually pristine. By the end of the course, you will be equipped to confidently construct, assess, and repair advanced surface models for a wide range of applications, from consumer product design to automotive and aerospace components.$d$,
 'CAD Design', 'Advanced', 0, 'published', 4.8, 0, true, '#3b82f6', NULL),

('SOLIDWORKS Sheet Metal Modeling',
 'solidworks-sheet-metal-modeling',
 'Master manufacturing-ready sheet metal design — walls, folds, flat patterns, bend allowances, and drawing views.',
 $d$This focused, hands-on sheet metal design course is tailored for engineers and designers who want to master the creation of parts that are ready for manufacturing. You will start with the fundamental methods for building primary walls and complex tapered or curved sheet metal bodies, while also learning how to add stiffening folds and generate flattened layouts for production. The course further explores advanced detailing techniques, such as creating cutouts for airflow or weight reduction, using stamping tools to produce raised or recessed features, and manipulating geometry between its folded and flattened states. By combining these approaches, you will develop the ability to design, flatten, document, and export production-ready sheet metal parts, including calculations for bend allowances, flat patterns, and drawing views, for applications such as enclosures, brackets, automotive panels, and HVAC components.$d$,
 'CAD Design', 'Intermediate', 0, 'published', 4.6, 0, true, '#3b82f6', NULL),

('SOLIDWORKS Weldment Modeling',
 'solidworks-weldment-modeling',
 'Project-driven course for welded structures and frames — profiles, cut lists, weld symbols, and fabrication drawings.',
 $d$This comprehensive, project-driven course focuses on designing welded structures and frames commonly used in machine frames, supports, railings, and industrial equipment. You will begin by creating structural components from standard profile shapes, and learn to precisely join intersecting members to produce clean, fabrication-ready connections. The curriculum also covers adding custom brackets or mounting plates, along with reinforcements for joints and finishing treatments for open tube ends to achieve a professional appearance. To simulate realistic welded assemblies, you will build a complete weld bed, learning to manage cut lists, prepare edges, and add weld representations, while also breaking sharp corners or preparing edges for joining. By the end of the course, you will confidently produce detailed drawings of welded structures, complete with material cut lists and welding symbols, ready for manufacturing and fabrication.$d$,
 'CAD Design', 'Intermediate', 0, 'published', 4.7, 0, true, '#3b82f6', NULL),

('SOLIDWORKS CAM Level 1',
 'solidworks-cam-level-1',
 'Introductory CNC programming inside SOLIDWORKS — toolpaths, material removal, drilling, simulation, and G-code output.',
 $d$This introductory computer-aided manufacturing course introduces you to standard, knowledge-based machining tools integrated directly into the design environment, allowing you to create efficient CNC toolpaths straight from your 3D models without leaving the familiar software interface. You will learn to automatically identify machinable areas using a built-in knowledge database, covering core operations such as material removal, surface finishing, hole making, and side cutting. The curriculum guides you through extracting manufacturable shapes from solid bodies, applying tool libraries and cutting parameters, and generating toolpaths for basic milling and drilling routines. You will also learn to simulate tool motion, verify material removal, and detect potential collisions before outputting machine-ready code. By mastering these standard integrated manufacturing capabilities, you will streamline the transition from design to production, reduce programming time, and gain confidence in producing ready-to-run CNC programs for simple prismatic parts.$d$,
 'CAD Design', 'Beginner', 0, 'published', 4.6, 0, true, '#3b82f6', NULL),

('SOLIDWORKS CAM Level 2',
 'solidworks-cam-level-2',
 'Advanced CNC programming — high-efficiency roughing, multi-part setups, lathe operations, and automated measurement.',
 $d$This advanced manufacturing course elevates your CNC programming skills to a professional level, building on foundational milling knowledge. You will explore a high-efficiency roughing strategy that significantly reduces cycle times while extending tool life. The curriculum covers complex manufacturing scenarios, including programming multiple parts or fixtures at once, and machining parts from several predefined angles without requiring full simultaneous multi-axis motion. You will also learn the fundamentals of lathe operations, including work holding, internal and external features, grooving, and threading for two-axis turning centers. Additional professional-level topics include storing multiple machining setups within a single part file and an introduction to automated in-process measurement cycles. By the end of this course, you will be fully equipped to program, optimize, and output efficient CNC toolpaths for both milled and turned components, ready for real-world manufacturing environments.$d$,
 'CAD Design', 'Advanced', 0, 'published', 4.7, 0, true, '#3b82f6', NULL),

('SOLIDWORKS Simulation Level 1',
 'solidworks-simulation-level-1',
 'Foundational FEA for parts and assemblies — stress, deformation, mesh techniques, and engineering reports.',
 $d$This foundational simulation course provides a powerful introduction to engineering analysis, enabling you to test and improve designs directly within your modeling environment. You will learn to perform structural assessments on both individual parts and complete assemblies, evaluating how they respond to factors like stress, deformation, and real-world loads while accounting for material behavior and boundary conditions. The curriculum emphasizes practical techniques for dividing models into small elements, including standard, curvature-sensitive, and blended approaches to achieve the right balance between accuracy and computation time for different shapes. You will also explore specialized methods for thin-walled structures, such as sheet metal or plastic enclosures, and for beam-like frameworks like trusses and structural skeletons, using efficient simplified elements to significantly reduce processing effort. By the end of this course, you will be able to confidently run simulations, interpret stress results, refine mesh quality, and generate detailed reports, enabling data-driven design decisions while minimizing costly physical prototypes.$d$,
 'Simulation', 'Beginner', 0, 'published', 4.8, 0, true, '#8b5cf6', NULL),

('SOLIDWORKS Simulation Level 2',
 'solidworks-simulation-level-2',
 'Advanced dynamic and nonlinear simulation — vibration, fatigue, buckling, impact, topology optimization, and design studies.',
 $d$This advanced simulation course extends your engineering analysis expertise into dynamic and nonlinear performance domains, equipping you to predict how products behave under vibration, instability, repeated loading, and impact conditions. You will learn to determine natural vibration patterns and mode shapes to ensure designs avoid resonance, as well as assess sudden structural collapse under compressive forces. The curriculum also covers a generative design approach that removes non-critical material while preserving stiffness and safety, allowing you to create lightweight, manufacturable shapes. For products subjected to repetitive loads, you will learn to predict crack initiation and component lifespan based on material stress-cycle data and loading histories. Additionally, you will simulate free-fall impact scenarios to evaluate stress, deformation, and rebound behavior of portable or shock-sensitive devices. Finally, you will apply automated refinement techniques to adjust design variables, such as dimensions or wall thickness, against multiple constraints like stress limits and target mass. By the end of this course, you will confidently validate designs against dynamic failure modes and generate high-fidelity simulation reports to support engineering decision-making.$d$,
 'Simulation', 'Advanced', 0, 'published', 4.9, 0, true, '#8b5cf6', NULL)

ON CONFLICT (slug) DO NOTHING;
