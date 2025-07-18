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
  Aperture,
  HeartHandshake,
  PersonStanding,
  BrainCircuit,
  Lightbulb,
  Music,
  Drama,
  Church,
  Cpu,
  Handshake,
  BookOpen,
  Sigma,
  TestTube,
  Scale,
  Bot,
  Columns,
  DollarSign,
  Baby,
  Wind,
  Sparkles,
  GraduationCap,
  Recycle,
  Sprout,
  PiggyBank
} from 'lucide-react';

export interface Topic {
  name: string;
  slug: string;
  description: string;
  progress: number;
  content?: string;
}

export interface Subject {
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  imageHint: string;
  gradeName: string; // Add gradeName to subject
  topics: Topic[];
}

export interface Grade {
  name:string;
  shortName: string;
  slug: string;
  description: string;
  subjects: Subject[];
}

export const curriculum: Grade[] = [
  // --- PREESCOLAR ---
  {
    name: 'Educación Preescolar',
    shortName: 'Preescolar',
    slug: 'preschool',
    description: "Desarrollo integral para los más pequeños a través de dimensiones.",
    subjects: [
      { name: 'Dimensión Comunicativa', slug: 'comunicativa', icon: Languages, description: 'Desarrollo del lenguaje y la expresión.', imageHint: "niños hablando", gradeName: 'Educación Preescolar', topics: [] },
      { name: 'Dimensión Corporal', slug: 'corporal', icon: PersonStanding, description: 'Desarrollo motor y expresión corporal.', imageHint: "niños jugando", gradeName: 'Educación Preescolar', topics: [] },
      { name: 'Dimensión Cognitiva', slug: 'cognitiva', icon: BrainCircuit, description: 'Desarrollo del pensamiento lógico.', imageHint: "niño rompecabezas", gradeName: 'Educación Preescolar', topics: [] },
      { name: 'Dimensión Socioafectiva', slug: 'socioafectiva', icon: HeartHandshake, description: 'Desarrollo de la autonomía y relaciones.', imageHint: "niños compartiendo", gradeName: 'Educación Preescolar', topics: [] },
      { name: 'Dimensión Estética', slug: 'estetica', icon: Palette, description: 'Desarrollo de la creatividad y el arte.', imageHint: "niño pintando", gradeName: 'Educación Preescolar', topics: [] },
      { name: 'Dimensión Espiritual', slug: 'espiritual', icon: Sparkles, description: 'Conocimiento de sí mismo y trascendencia.', imageHint: "niño meditando", gradeName: 'Educación Preescolar', topics: [] },
    ],
  },
  // --- BÁSICA PRIMARIA ---
  {
    name: 'Básica Primaria (1°-5°)',
    shortName: '1° a 5°',
    slug: 'primary',
    description: "Consolidación de áreas y asignaturas fundamentales.",
    subjects: [
      { name: 'Lengua Castellana', slug: 'spanish-primary', icon: BookOpen, description: 'Lectura, escritura y gramática.', imageHint: 'libro abierto', gradeName: 'Básica Primaria (1°-5°)', topics: [] },
      { name: 'Inglés', slug: 'english-primary', icon: Globe, description: 'Aprendizaje de un idioma extranjero.', imageHint: 'banderas mundo', gradeName: 'Básica Primaria (1°-5°)', topics: [] },
      { name: 'Matemáticas', slug: 'math-primary', icon: Calculator, description: 'Aritmética y geometría.', imageHint: 'ábaco números', gradeName: 'Básica Primaria (1°-5°)', topics: [] },
      { name: 'Ciencias Naturales', slug: 'natural-sciences', icon: Sprout, description: 'Estudio del entorno y seres vivos.', imageHint: 'planta creciendo', gradeName: 'Básica Primaria (1°-5°)', topics: [] },
      { name: 'Educación Ambiental', slug: 'environmental-ed-primary', icon: Recycle, description: 'Cuidado del medio ambiente.', imageHint: 'planeta manos', gradeName: 'Básica Primaria (1°-5°)', topics: [] },
      { name: 'Ciencias Sociales', slug: 'social-sciences', icon: Landmark, description: 'Historia, geografía y democracia.', imageHint: 'mapa antiguo', gradeName: 'Básica Primaria (1°-5°)', topics: [] },
      { name: 'Educación Artística', slug: 'arts-primary', icon: Music, description: 'Música, artes plásticas y danza.', imageHint: 'pinceles colores', gradeName: 'Básica Primaria (1°-5°)', topics: [] },
      { name: 'Ética y Valores', slug: 'ethics-primary', icon: Handshake, description: 'Formación en valores humanos.', imageHint: 'manos unidas', gradeName: 'Básica Primaria (1°-5°)', topics: [] },
      { name: 'Educación Religiosa', slug: 'religion-primary', icon: Church, description: 'Aprendizaje sobre diversas creencias.', imageHint: 'vitral iglesia', gradeName: 'Básica Primaria (1°-5°)', topics: [] },
      { name: 'Educación Física', slug: 'phys-ed-primary', icon: PersonStanding, description: 'Recreación y deportes.', imageHint: 'niños corriendo', gradeName: 'Básica Primaria (1°-5°)', topics: [] },
      { name: 'Tecnología e Informática', slug: 'tech-primary', icon: Cpu, description: 'Nociones básicas de tecnología.', imageHint: 'niño computador', gradeName: 'Básica Primaria (1°-5°)', topics: [] },
      { name: 'Emprendimiento', slug: 'entrepreneurship-primary', icon: Lightbulb, description: 'Introducción a la creación de proyectos.', imageHint: 'niño idea', gradeName: 'Básica Primaria (1°-5°)', topics: [] },
    ],
  },
  // --- BÁSICA SECUNDARIA ---
  {
    name: 'Básica Secundaria (6°-9°)',
    shortName: '6° a 9°',
    slug: 'secondary',
    description: "Profundización en áreas del conocimiento.",
    subjects: [
      { name: 'Lengua Castellana', slug: 'spanish-secondary', icon: BookOpen, description: 'Análisis literario y gramática avanzada.', imageHint: 'pila libros', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
      { name: 'Inglés', slug: 'english-secondary', icon: Globe, description: 'Competencias comunicativas en inglés.', imageHint: 'estudiante extranjero', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
      { name: 'Matemáticas', slug: 'math-secondary', icon: Sigma, description: 'Álgebra, geometría y estadística.', imageHint: 'pizarra formulas', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
      { name: 'Biología', slug: 'biology', icon: Atom, description: 'El estudio de la vida y los organismos.', imageHint: 'microscopio celula', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
      { name: 'Química', slug: 'chemistry', icon: TestTube, description: 'La ciencia de la materia y sus cambios.', imageHint: 'tubos ensayo', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
      { name: 'Física', slug: 'physics', icon: Aperture, description: 'Principios de movimiento, fuerza y energía.', imageHint: 'péndulo newton', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
      { name: 'Ciencias Sociales', slug: 'social-studies-secondary', icon: Landmark, description: 'Historia, geografía y cátedra de la paz.', imageHint: 'mapa mundial', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
      { name: 'Educación Artística', slug: 'arts-secondary', icon: Drama, description: 'Expresión en artes, música y danzas.', imageHint: 'mascaras teatro', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
      { name: 'Ética y Valores', slug: 'ethics-secondary', icon: Handshake, description: 'Reflexión sobre el comportamiento humano.', imageHint: 'balanza justicia', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
      { name: 'Educación Religiosa', slug: 'religion-secondary', icon: Church, description: 'Estudio de hechos religiosos.', imageHint: 'libro sagrado', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
      { name: 'Educación Física', slug: 'phys-ed-secondary', icon: PersonStanding, description: 'Deportes y salud corporal.', imageHint: 'cancha deportiva', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
      { name: 'Tecnología e Informática', slug: 'tech-secondary', icon: Cpu, description: 'Desarrollo de habilidades digitales.', imageHint: 'código programación', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
      { name: 'Filosofía', slug: 'philosophy-secondary', icon: BrainCircuit, description: 'Introducción al pensamiento crítico.', imageHint: 'busto filósofo', gradeName: 'Básica Secundaria (6°-9°)', topics: [] },
    ],
  },
  // --- EDUCACIÓN MEDIA ---
  {
    name: 'Educación Media (10°-11°)',
    shortName: '10° y 11°',
    slug: 'high-school',
    description: "Especialización y preparación para el futuro.",
    subjects: [
      { name: 'Lectura Crítica', slug: 'critical-reading', icon: Book, description: 'Análisis profundo de textos complejos.', imageHint: 'lupa libro', gradeName: 'Educación Media (10°-11°)', topics: [] },
      { name: 'Matemáticas', slug: 'advanced-math', icon: Sigma, description: 'Trigonometría, cálculo y geometría analítica.', imageHint: 'grafico complejo', gradeName: 'Educación Media (10°-11°)', topics: [] },
      { name: 'Física', slug: 'physics-high', icon: Aperture, description: 'Leyes y fenómenos del universo físico.', imageHint: 'diagrama átomo', gradeName: 'Educación Media (10°-11°)', topics: [] },
      { name: 'Química', slug: 'chemistry-high', icon: TestTube, description: 'Estudio de las reacciones y la materia.', imageHint: 'molécula 3d', gradeName: 'Educación Media (10°-11°)', topics: [] },
      { name: 'Biología', slug: 'biology-high', icon: Atom, description: 'Genética, evolución y ecosistemas.', imageHint: 'cadena adn', gradeName: 'Educación Media (10°-11°)', topics: [] },
      { name: 'Ciencias Políticas y Económicas', slug: 'politics-economics', icon: Scale, description: 'Sistemas políticos y económicos.', imageHint: 'edificio gobierno', gradeName: 'Educación Media (10°-11°)', topics: [] },
      { name: 'Filosofía', slug: 'philosophy-high', icon: BrainCircuit, description: 'Grandes pensadores y corrientes filosóficas.', imageHint: 'estatua pensador', gradeName: 'Educación Media (10°-11°)', topics: [] },
      { name: 'Religión', slug: 'religion-high', icon: Church, description: 'Análisis filosófico de la religión.', imageHint: 'manos orando', gradeName: 'Educación Media (10°-11°)', topics: [] },
      { name: 'Educación Física', slug: 'phys-ed-high', icon: PersonStanding, description: 'Entrenamiento y vida saludable.', imageHint: 'atleta corriendo', gradeName: 'Educación Media (10°-11°)', topics: [] },
      { name: 'Tecnología', slug: 'tech-high', icon: Bot, description: 'Aplicaciones tecnológicas avanzadas.', imageHint: 'brazo robótico', gradeName: 'Educación Media (10°-11°)', topics: [] },
    ],
  },
];

export const findGrade = (slug: string) => curriculum.find(g => g.slug === slug);
export const findSubject = (gradeSlug: string, subjectSlug: string) =>
  findGrade(gradeSlug)?.subjects.find(s => s.slug === subjectSlug);
