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
    name: 'Preescolar',
    slug: 'preschool',
    description: "Conceptos fundamentales para los más pequeños.",
    subjects: [
      {
        name: 'Colores y Formas',
        slug: 'colors-shapes',
        icon: Palette,
        description: 'Aprende sobre los colores básicos y las formas geométricas.',
        imageHint: "bloques coloridos",
        topics: [
          { name: 'Colores Primarios', slug: 'primary-colors', description: 'Rojo, amarillo y azul.', progress: 100 },
          { name: 'Formas Básicas', slug: 'basic-shapes', description: 'Círculos, cuadrados y triángulos.', progress: 50 },
        ],
      },
      {
        name: 'Contar',
        slug: 'counting',
        icon: Calculator,
        description: 'Introducción a los números y a contar del 1 al 10.',
        imageHint: "juguete para contar",
        topics: [
          { name: 'Números 1-5', slug: 'numbers-1-5', description: 'Reconocer y contar hasta 5.', progress: 80 },
          { name: 'Números 6-10', slug: 'numbers-6-10', description: 'Contar del 6 al 10.', progress: 20 },
        ],
      },
    ],
  },
  {
    name: 'Tercer Grado',
    slug: 'third-grade',
    description: "Ampliando conocimientos en materias básicas.",
    subjects: [
      {
        name: 'Matemáticas',
        slug: 'mathematics',
        icon: Calculator,
        description: 'Multiplicación, división y fracciones.',
        imageHint: "ábaco aula",
        topics: [
          { name: 'Tablas de Multiplicar', slug: 'multiplication-tables', description: 'Dominar las tablas del 1 al 10.', progress: 75 },
          { name: 'Introducción a las Fracciones', slug: 'intro-fractions', description: 'Entender las partes de un todo.', progress: 40 },
          { name: 'Conceptos Básicos de División', slug: 'division-basics', description: 'Problemas de división simples.', progress: 10 },
        ],
      },
      {
        name: 'Ciencias Naturales',
        slug: 'natural-sciences',
        icon: FlaskConical,
        description: 'Explorando el mundo natural, desde plantas hasta planetas.',
        imageHint: "niño microscopio",
        topics: [
          { name: 'El Ciclo del Agua', slug: 'water-cycle', description: 'Evaporación, condensación, precipitación.', progress: 90 },
          { name: 'El Sistema Solar', slug: 'solar-system', description: 'Aprendiendo sobre los planetas.', progress: 60 },
          { name: 'Vida Vegetal', slug: 'plant-life', description: 'Partes de una planta y fotosíntesis.', progress: 30 },
        ],
      },
      {
        name: 'Lenguaje',
        slug: 'language',
        icon: Languages,
        description: 'Comprensión lectora y habilidades gramaticales.',
        imageHint: "leyendo libro",
        topics: [
          { name: 'Partes de la Oración', slug: 'parts-of-speech', description: 'Sustantivos, verbos y adjetivos.', progress: 100 },
          { name: 'Construcción de Oraciones', slug: 'building-sentences', description: 'Concordancia sujeto-verbo.', progress: 85 },
        ],
      },
    ],
  },
  {
    name: 'Octavo Grado',
    slug: 'eighth-grade',
    description: "Temas avanzados en preparación para la secundaria.",
    subjects: [
      {
        name: 'Álgebra',
        slug: 'algebra',
        icon: FileCode,
        description: 'Introducción a expresiones y ecuaciones algebraicas.',
        imageHint: "pizarra ecuaciones",
        topics: [
          { name: 'Ecuaciones Lineales', slug: 'linear-equations', description: 'Resolviendo para x.', progress: 65 },
          { name: 'Polinomios', slug: 'polynomials', description: 'Conceptos básicos de expresiones polinómicas.', progress: 15 },
        ],
      },
      {
        name: 'Física',
        slug: 'physics',
        icon: Atom,
        description: 'Principios fundamentales del movimiento, fuerza y energía.',
        imageHint: "péndulo de newton",
        topics: [
          { name: 'Leyes de Newton', slug: 'newtons-laws', description: 'Inercia, F=ma y acción-reacción.', progress: 45 },
          { name: 'Formas de Energía', slug: 'forms-of-energy', description: 'Energía cinética, potencial y térmica.', progress: 25 },
        ],
      },
      {
        name: 'Historia Universal',
        slug: 'world-history',
        icon: Landmark,
        description: 'Explorando las principales civilizaciones y eventos mundiales.',
        imageHint: "ruinas antiguas",
        topics: [
            { name: 'Antigua Roma', slug: 'ancient-rome', description: 'La República y el Imperio.', progress: 95 },
            { name: 'El Renacimiento', slug: 'the-renaissance', description: 'Un renacer del arte y la ciencia.', progress: 50 },
        ]
      }
    ],
  },
];

export const findGrade = (slug: string) => curriculum.find(g => g.slug === slug);
export const findSubject = (gradeSlug: string, subjectSlug: string) => 
  findGrade(gradeSlug)?.subjects.find(s => s.slug === subjectSlug);
