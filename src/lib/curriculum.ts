import {
  type LucideIcon,
  Book,
  Calculator,
  FlaskConical,
  Globe,
  Palette,
  Atom,
  Languages,
  Landmark,
  FileCode,
  Aperture
} from 'lucide-react';

export interface Topic {
  name: string;
  slug: string;
  description: string;
  progress: number;
}

export interface Subject {
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  imageHint: string;
  topics: Topic[];
}

export interface Grade {
  name:string;
  slug: string;
  description: string;
  subjects: Subject[];
}

export const curriculum: Grade[] = [
  {
    name: 'Preschool',
    slug: 'preschool',
    description: "Fundamental concepts for early learners.",
    subjects: [
      {
        name: 'Colors & Shapes',
        slug: 'colors-shapes',
        icon: Palette,
        description: 'Learn about the basic colors and geometric shapes.',
        imageHint: "colorful blocks",
        topics: [
          { name: 'Primary Colors', slug: 'primary-colors', description: 'Red, yellow, and blue.', progress: 100 },
          { name: 'Basic Shapes', slug: 'basic-shapes', description: 'Circles, squares, and triangles.', progress: 50 },
        ],
      },
      {
        name: 'Counting',
        slug: 'counting',
        icon: Calculator,
        description: 'Introduction to numbers and counting from 1 to 10.',
        imageHint: "counting toy",
        topics: [
          { name: 'Numbers 1-5', slug: 'numbers-1-5', description: 'Recognizing and counting up to 5.', progress: 80 },
          { name: 'Numbers 6-10', slug: 'numbers-6-10', description: 'Counting from 6 to 10.', progress: 20 },
        ],
      },
    ],
  },
  {
    name: 'Third Grade',
    slug: 'third-grade',
    description: "Expanding knowledge in core subjects.",
    subjects: [
      {
        name: 'Mathematics',
        slug: 'mathematics',
        icon: Calculator,
        description: 'Multiplication, division, and fractions.',
        imageHint: "abacus classroom",
        topics: [
          { name: 'Multiplication Tables', slug: 'multiplication-tables', description: 'Mastering tables from 1 to 10.', progress: 75 },
          { name: 'Introduction to Fractions', slug: 'intro-fractions', description: 'Understanding parts of a whole.', progress: 40 },
          { name: 'Division Basics', slug: 'division-basics', description: 'Simple division problems.', progress: 10 },
        ],
      },
      {
        name: 'Natural Sciences',
        slug: 'natural-sciences',
        icon: FlaskConical,
        description: 'Exploring the natural world, from plants to planets.',
        imageHint: "child microscope",
        topics: [
          { name: 'The Water Cycle', slug: 'water-cycle', description: 'Evaporation, condensation, precipitation.', progress: 90 },
          { name: 'The Solar System', slug: 'solar-system', description: 'Learning about the planets.', progress: 60 },
          { name: 'Plant Life', slug: 'plant-life', description: 'Parts of a plant and photosynthesis.', progress: 30 },
        ],
      },
      {
        name: 'Language',
        slug: 'language',
        icon: Languages,
        description: 'Reading comprehension and grammar skills.',
        imageHint: "reading book",
        topics: [
          { name: 'Parts of Speech', slug: 'parts-of-speech', description: 'Nouns, verbs, and adjectives.', progress: 100 },
          { name: 'Building Sentences', slug: 'building-sentences', description: 'Subject-verb agreement.', progress: 85 },
        ],
      },
    ],
  },
  {
    name: 'Eighth Grade',
    slug: 'eighth-grade',
    description: "Advanced topics in preparation for high school.",
    subjects: [
      {
        name: 'Algebra',
        slug: 'algebra',
        icon: FileCode,
        description: 'Introduction to algebraic expressions and equations.',
        imageHint: "chalkboard equations",
        topics: [
          { name: 'Linear Equations', slug: 'linear-equations', description: 'Solving for x.', progress: 65 },
          { name: 'Polynomials', slug: 'polynomials', description: 'Basics of polynomial expressions.', progress: 15 },
        ],
      },
      {
        name: 'Physics',
        slug: 'physics',
        icon: Atom,
        description: 'Fundamental principles of motion, force, and energy.',
        imageHint: "newtons cradle",
        topics: [
          { name: 'Newton\'s Laws of Motion', slug: 'newtons-laws', description: 'Inertia, F=ma, and action-reaction.', progress: 45 },
          { name: 'Forms of Energy', slug: 'forms-of-energy', description: 'Kinetic, potential, and thermal energy.', progress: 25 },
        ],
      },
      {
        name: 'World History',
        slug: 'world-history',
        icon: Landmark,
        description: 'Exploring major world civilizations and events.',
        imageHint: "ancient ruins",
        topics: [
            { name: 'Ancient Rome', slug: 'ancient-rome', description: 'The Republic and the Empire.', progress: 95 },
            { name: 'The Renaissance', slug: 'the-renaissance', description: 'A rebirth of art and science.', progress: 50 },
        ]
      }
    ],
  },
];

export const findGrade = (slug: string) => curriculum.find(g => g.slug === slug);
export const findSubject = (gradeSlug: string, subjectSlug: string) => 
  findGrade(gradeSlug)?.subjects.find(s => s.slug === subjectSlug);
