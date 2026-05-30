import type { NoteSection, StudySubtopic } from "./study-types";

export type ExamBoard = "edexcel" | "aqa" | "ocra" | "ocrb";
export type CourseType = "maths" | "further";
export type AcademicYear = "year1" | "year2";
export type AlevelModule = "pure" | "mechanics" | "statistics";

export const EXAM_BOARDS: { id: ExamBoard; label: string }[] = [
  { id: "edexcel", label: "Edexcel" },
  { id: "aqa", label: "AQA" },
  { id: "ocra", label: "OCR A" },
  { id: "ocrb", label: "OCR B" },
];

export const COURSE_TYPES: { id: CourseType; label: string }[] = [
  { id: "maths", label: "A-Level Mathematics" },
  { id: "further", label: "A-Level Further Mathematics" },
];

export const ACADEMIC_YEARS: { id: AcademicYear; label: string }[] = [
  { id: "year1", label: "Year 1" },
  { id: "year2", label: "Year 2" },
];

export const ALEVEL_MODULES: { id: AlevelModule; label: string }[] = [
  { id: "pure", label: "Pure Mathematics" },
  { id: "mechanics", label: "Mechanics" },
  { id: "statistics", label: "Statistics" },
];

const Y1_PURE_SHARED = [
  "Proof",
  "Quadratics",
  "Simultaneous equations",
  "Graphs and transformations",
  "Coordinate geometry",
  "Binomial expansion",
  "Trigonometric ratios and identities",
  "Exponentials and logarithms",
  "Differentiation",
  "Integration",
  "2D Vectors",
];

const Y1_MECHANICS_SHARED = [
  "Quantities and units",
  "Kinematics",
  "Forces and Newton's laws",
];

const Y1_STATISTICS_SHARED = [
  "Data collection",
  "Measures of location and spread",
  "Representations of data",
  "Correlation",
  "Probability",
  "Statistical distributions",
];

const Y2_PURE_MATHS = [
  "Proof",
  "Partial fractions",
  "Functions",
  "Sequences and series",
  "Binomial expansion",
  "Radians",
  "Trigonometric functions",
  "Parametric equations",
  "Differentiation",
  "Integration",
  "Numerical methods",
  "Vectors",
];

const Y2_MECHANICS = [
  "Quantities and units in mechanics",
  "Kinematics",
  "Forces and Newton's laws",
  "Moments",
  "Projectiles",
  "Applications of forces",
];

const Y2_STATISTICS = [
  "Regression",
  "Conditional probability",
  "The normal distribution",
  "Hypothesis testing",
  "Chi-squared tests",
];

const Y1_FURTHER_PURE = [
  "Complex numbers",
  "Matrices",
  "Further algebra and functions",
  "Series",
  "Proof by induction",
  "Vectors in 3D",
];

const Y2_FURTHER_PURE = [
  "Complex numbers",
  "Further algebra",
  "Series",
  "Hyperbolic functions",
  "Polar coordinates",
  "Differential equations",
  "Numerical methods",
];

const Y1_FURTHER_MECHANICS = [
  "Dimensional analysis",
  "Work, energy and power",
  "Impulse and momentum",
  "Centre of mass",
];

const Y1_FURTHER_STATS = [
  "Discrete probability distributions",
  "Poisson distribution",
  "Type I and II errors",
  "Chi-squared tests",
];

function curriculumKey(
  board: ExamBoard,
  course: CourseType,
  year: AcademicYear,
  module: AlevelModule,
): string {
  return `${board}-${course}-${year}-${module}`;
}

function register(
  map: Record<string, string[]>,
  titles: string[],
  board: ExamBoard | ExamBoard[],
  course: CourseType,
  year: AcademicYear,
  module: AlevelModule,
) {
  const boards = Array.isArray(board) ? board : [board];
  for (const b of boards) {
    map[curriculumKey(b, course, year, module)] = titles;
  }
}

const SUBTOPIC_REGISTRY: Record<string, string[]> = {};

register(SUBTOPIC_REGISTRY, Y1_PURE_SHARED, ["edexcel", "aqa", "ocra", "ocrb"], "maths", "year1", "pure");
register(SUBTOPIC_REGISTRY, Y1_MECHANICS_SHARED, ["edexcel", "aqa", "ocra", "ocrb"], "maths", "year1", "mechanics");
register(SUBTOPIC_REGISTRY, Y1_STATISTICS_SHARED, ["edexcel", "aqa", "ocra", "ocrb"], "maths", "year1", "statistics");
register(SUBTOPIC_REGISTRY, Y2_PURE_MATHS, ["edexcel", "aqa", "ocra", "ocrb"], "maths", "year2", "pure");
register(SUBTOPIC_REGISTRY, Y2_MECHANICS, ["edexcel", "aqa", "ocra", "ocrb"], "maths", "year2", "mechanics");
register(SUBTOPIC_REGISTRY, Y2_STATISTICS, ["edexcel", "aqa", "ocra", "ocrb"], "maths", "year2", "statistics");
register(SUBTOPIC_REGISTRY, Y1_FURTHER_PURE, ["edexcel", "aqa", "ocra", "ocrb"], "further", "year1", "pure");
register(SUBTOPIC_REGISTRY, Y2_FURTHER_PURE, ["edexcel", "aqa", "ocra", "ocrb"], "further", "year2", "pure");
register(SUBTOPIC_REGISTRY, Y1_FURTHER_MECHANICS, ["edexcel", "aqa"], "further", "year1", "mechanics");
register(SUBTOPIC_REGISTRY, Y1_FURTHER_STATS, ["edexcel", "aqa"], "further", "year1", "statistics");

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function resolveAlevelSubtopicTitles(
  board: ExamBoard,
  course: CourseType,
  year: AcademicYear,
  module: AlevelModule,
): string[] {
  const key = curriculumKey(board, course, year, module);
  const found = SUBTOPIC_REGISTRY[key];
  if (found) return found;

  if (module === "pure") return course === "further" ? Y1_FURTHER_PURE : Y1_PURE_SHARED;
  if (module === "mechanics") return Y1_MECHANICS_SHARED;
  return Y1_STATISTICS_SHARED;
}

function boardLabel(board: ExamBoard): string {
  return EXAM_BOARDS.find((b) => b.id === board)?.label ?? board;
}

function buildNotes(
  title: string,
  module: AlevelModule,
  board: ExamBoard,
  course: CourseType,
  year: AcademicYear,
): NoteSection[] {
  const courseLabel =
    COURSE_TYPES.find((c) => c.id === course)?.label ?? "A-Level";
  const yearLabel = year === "year1" ? "Year 1 (AS)" : "Year 2 (A2)";

  const moduleIntro: Record<AlevelModule, string> = {
    pure:
      "Pure topics build algebraic fluency and calculus skills that underpin the rest of the A-Level course.",
    mechanics:
      "Mechanics models motion using forces, vectors, and Newton's laws — always define a clear diagram and sign convention.",
    statistics:
      "Statistics combines data handling with probability models; check whether variables are discrete or continuous.",
  };

  return [
    {
      heading: `${title} — overview`,
      paragraphs: [
        `This module sits within ${boardLabel(board)} ${courseLabel}, ${yearLabel}, ${ALEVEL_MODULES.find((m) => m.id === module)?.label}.`,
        moduleIntro[module],
        `Exam questions on "${title}" often combine routine technique with interpretation — practise explaining each step in words as well as algebra.`,
      ],
    },
    {
      heading: "What to focus on",
      paragraphs: [
        "Learn standard results from your specification formula booklet, then practise exam-style mixed questions under timed conditions.",
        "Mark schemes reward clear method: set out given information, state formulae, and check answers for reasonableness.",
      ],
    },
  ];
}

function buildPractice(
  title: string,
  module: AlevelModule,
  board: ExamBoard,
  course: CourseType,
): StudySubtopic["practice"] {
  const label = `${boardLabel(board)} · ${COURSE_TYPES.find((c) => c.id === course)?.label}`;

  if (module === "pure") {
    if (title.toLowerCase().includes("differentiation")) {
      return {
        paperLabel: `${label} · Pure`,
        parts: [
          "\\text{Find } \\dfrac{dy}{dx} \\text{ when } y = x^3\\ln x, \\; x>0.",
          "\\textbf{(i)} \\text{ Hence find the coordinates of the stationary point.}",
        ],
        solutionSteps: [
          {
            title: "Product rule",
            tex: "\\dfrac{dy}{dx} = 3x^2\\ln x + x^3\\cdot\\tfrac{1}{x} = 3x^2\\ln x + x^2.",
          },
          {
            title: "Stationary point",
            tex: "3x^2\\ln x + x^2 = 0 \\Rightarrow x = e^{-1/3} \\text{ (reject } x=0\\text{).}",
          },
        ],
      };
    }
    if (title.toLowerCase().includes("integration")) {
      return {
        paperLabel: `${label} · Pure`,
        parts: [
          "\\text{Find } \\displaystyle \\int_0^1 x e^{2x}\\,dx.",
        ],
        solutionSteps: [
          {
            title: "Integration by parts",
            tex: "u=x,\\; \\dfrac{dv}{dx}=e^{2x} \\Rightarrow \\int_0^1 x e^{2x}\\,dx = \\tfrac{1}{4} + \\tfrac{1}{4e^2}.",
          },
        ],
      };
    }
    if (title.toLowerCase().includes("complex")) {
      return {
        paperLabel: `${label} · Further Pure`,
        parts: [
          "\\text{Express } z = -1 + i \\text{ in the form } re^{i\\theta}, \\; -\\pi < \\theta \\leq \\pi.",
        ],
        solutionSteps: [
          { title: "Modulus", tex: "r = \\sqrt{2}." },
          { title: "Argument", tex: "\\theta = \\tfrac{3\\pi}{4}." },
        ],
      };
    }
  }

  if (module === "mechanics") {
    return {
      paperLabel: `${label} · Mechanics`,
      parts: [
        "\\text{A particle moves with velocity } v = 3t^2 - 4t \\text{ m s}^{-1}. \\text{ Find displacement from } t=0 \\text{ to } t=2.",
      ],
      solutionSteps: [
        {
          title: "Integrate",
          tex: "s = \\int_0^2 (3t^2-4t)\\,dt = \\bigl[t^3 - 2t^2\\bigr]_0^2 = 0.",
        },
      ],
    };
  }

  return {
    paperLabel: `${label} · Statistics`,
    parts: [
      "\\text{A discrete random variable } X \\text{ takes values 0,1,2 with } \\mathbb{P}(X=k) \\propto k+1.",
      "\\textbf{(i)} \\text{ Find the value of the constant of proportionality.}",
    ],
    solutionSteps: [
      {
        title: "Normalise",
        tex: "k(1+2+3)=1 \\Rightarrow k = \\tfrac{1}{6}.",
      },
    ],
  };
}

export function buildAlevelSubtopic(
  title: string,
  board: ExamBoard,
  course: CourseType,
  year: AcademicYear,
  module: AlevelModule,
): StudySubtopic {
  const id = slugifyTitle(`${board}-${course}-${year}-${module}-${title}`);
  return {
    id,
    title,
    notes: buildNotes(title, module, board, course, year),
    practice: buildPractice(title, module, board, course),
  };
}

export function resolveAlevelSubtopics(
  board: ExamBoard,
  course: CourseType,
  year: AcademicYear,
  module: AlevelModule,
): StudySubtopic[] {
  return resolveAlevelSubtopicTitles(board, course, year, module).map((title) =>
    buildAlevelSubtopic(title, board, course, year, module),
  );
}

export function getAlevelSubtopic(
  subtopics: StudySubtopic[],
  subtopicId: string,
): StudySubtopic | undefined {
  return subtopics.find((s) => s.id === subtopicId);
}
