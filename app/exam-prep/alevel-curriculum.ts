import type { NoteSection, StudySubtopic } from "./study-types";

export type ExamBoard = "edexcel" | "aqa" | "ocra" | "ocrb";
export type CourseType = "maths" | "further";
export type AcademicYear = "year1" | "year2";
export type AlevelModule = "pure" | "mechanics" | "statistics";

export const EXAM_BOARDS: { id: ExamBoard; label: string }[] = [
  { id: "edexcel", label: "Edexcel" },
  { id: "aqa", label: "AQA" },
  { id: "ocra", label: "OCR A" },
  { id: "ocrb", label: "OCR B (MEI)" },
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
  // If it's Further Maths
  if (course === "further") {
    if (module === "pure") return year === "year1" ? Y1_FURTHER_PURE : Y2_FURTHER_PURE;
    if (module === "mechanics") return Y1_FURTHER_MECHANICS;
    return Y1_FURTHER_STATS;
  }

  // Regular A-Level Maths
  if (year === "year1") {
    if (module === "pure") {
      if (board === "aqa") {
        return [
          "Proof",
          "Algebra and Functions",
          "Inequalities",
          "Graphs and Transformations",
          "Coordinate Geometry",
          "Binomial Expansion",
          "Trigonometry",
          "Exponentials and Logarithms",
          "Differentiation",
          "Integration",
          "2D Vectors",
        ];
      }
      return [
        "Proof",
        "Quadratics",
        "Simultaneous Equations",
        "Inequalities",
        "Graphs and Transformations",
        "Coordinate Geometry",
        "Binomial Expansion",
        "Trigonometry",
        "Exponentials and Logarithms",
        "Differentiation",
        "Integration",
        "2D Vectors",
      ];
    }
    if (module === "mechanics") {
      return [
        "Quantities and Units",
        "Kinematics",
        "Forces and Newton's Laws",
      ];
    }
    // statistics
    return [
      "Data Collection",
      "Measures of Location and Spread",
      "Representations of Data",
      "Correlation",
      "Probability",
      "Statistical Distributions",
      "Binomial Hypothesis Testing",
    ];
  }

  // Year 2 A-Level Maths
  if (module === "pure") {
    let list = [
      "Proof",
      "Partial Fractions",
      "Functions",
      "Sequences and Series",
      "Binomial Expansion",
      "Radians",
      "Trigonometric Functions",
      "Parametric Equations",
      "Differentiation",
      "Integration",
      "Numerical Methods",
      "3D Vectors",
    ];

    if (board === "ocra") {
      list = [
        "Proof",
        "Partial Fractions",
        "Functions",
        "Sequences and Series",
        "Binomial Expansion",
        "Radians",
        "Trigonometric Functions",
        "Parametric Equations",
        "Differentiation",
        "Integration",
        "Numerical Methods",
        "3D Vectors",
        "Mathematical Literacy",
      ];
    } else if (board === "ocrb") {
      list = [
        "Proof",
        "Partial Fractions",
        "Functions",
        "Sequences and Series",
        "Binomial Expansion",
        "Radians",
        "Trigonometric Functions",
        "Parametric Equations",
        "Differentiation",
        "Integration",
        "Numerical Methods and Modelling",
        "3D Vectors",
      ];
    }
    return list;
  }

  if (module === "mechanics") {
    return [
      "Kinematics (Projectiles)",
      "Friction and Inclined Planes",
      "Connected Particles",
      "Rigid Body Moments",
    ];
  }

  // statistics
  return [
    "Regression and Correlation",
    "Conditional Probability",
    "The Normal Distribution",
    "Normal Hypothesis Testing",
    "The Large Data Set",
  ];
}

export function getSubtopicDescriptionForBoard(
  title: string,
  board: ExamBoard,
  course: CourseType,
  year: AcademicYear,
): string {
  // If it's further maths, return the default subtopic descriptions
  if (course === "further") {
    const t = title.toLowerCase();
    if (t.includes("proof")) return "Mastering proof by induction, contradiction, and algebraic deduction.";
    if (t.includes("complex")) return "Imaginary units, Argand diagrams, and de Moivre's theorem.";
    if (t.includes("matri")) return "Linear transformations, determinants, and spaces.";
    if (t.includes("hyperbolic")) return "Hyperbolic functions, definitions, identities, and calculus.";
    if (t.includes("polar")) return "Polar coordinates, curve sketching, and area bounds.";
    if (t.includes("kinematics")) return "Variable acceleration, dimensional analysis, and calculus of motion.";
    if (t.includes("work")) return "Work, energy, power, and conservation of mechanical energy.";
    if (t.includes("impulse")) return "Impulse, momentum, and elastic collisions in 1D and 2D.";
    if (t.includes("centre")) return "Centres of mass for laminas, frameworks, and rigid bodies.";
    if (t.includes("distribution")) return "Poisson, geometric, and negative binomial models.";
    if (t.includes("chi-squared")) return "Goodness of fit, contingency tables, and hypothesis tests.";
    if (t.includes("type i")) return "Understanding Type I and Type II errors and significance levels.";
    return "Explore advanced Further Maths insights, detailed revision notes, and timed practice sets.";
  }

  // Exact math descriptions
  if (title === "Algebra and Functions") {
    return "Solving quadratic equations, completing the square, discriminant properties, and solving linear and quadratic simultaneous systems.";
  }
  if (title === "Mathematical Literacy") {
    return "Critiquing mathematical errors, logical presentation, and processing structural multi-stage problem descriptions.";
  }
  if (title === "Numerical Methods and Modelling") {
    return "Root finding, trapezium rule errors, Newton-Raphson, and iterating mathematical modeling cycles.";
  }

  // Large Data Set overrides per board
  if (title === "The Large Data Set") {
    if (board === "aqa") {
      return "Analyzing and navigating data distributions within the official AQA Large Data Set (encompassing health, population, and socio-economic indicators).";
    }
    if (board === "ocra") {
      return "Interpreting trends, cleaning fields, and processing patterns within the official OCR A Large Data Set (covering UK business, demographics, and regional economies).";
    }
    if (board === "ocrb") {
      return "Manipulating and interpreting data structures from the official OCR B MEI Large Data Set (focusing on global geographic, environmental, and wealth metrics).";
    }
    return "Investigating data fields, cleaning missing entries, and analyzing the official Edexcel Weather Dataset.";
  }

  // Base list of descriptions mapped to title
  const descMap: Record<string, string> = {
    // Pure Year 1
    "Proof": year === "year1"
      ? "Algebraic proof, proof by deduction, and disproving statements using counter-examples."
      : "Mastering proof by contradiction, exhaustion, and structured deduction for A2.",
    "Quadratics": "Solving quadratic equations, completing the square, functions, and discriminant properties.",
    "Simultaneous Equations": "Solving linear and quadratic simultaneous systems analytically and graphically.",
    "Inequalities": "Solving linear and quadratic inequalities and representing regions graphically.",
    "Graphs and Transformations": "Cubic, quartic, and reciprocal graphs; sketching curves with f(x) transformations.",
    "Coordinate Geometry": "Straight line equations, parallel/perpendicular lines, and the coordinate geometry of circles.",
    "Binomial Expansion": year === "year1"
      ? "Expanding (1 + x)ⁿ for positive integer n, notations, and calculating coefficients."
      : "Expanding (1 + x)ⁿ for negative or fractional n, including structural convergence domains.",
    "Trigonometry": "Sine/cosine rules, trigonometric identities (sin² + cos² = 1, tan = sin/cos), and solving equations.",
    "Exponentials and Logarithms": "Laws of logarithms, solving exponential equations, and modeling growth/decay.",
    "Differentiation": year === "year1"
      ? "First principles, differentiating xⁿ, gradients, tangents, normals, and turning points."
      : "Chain rule, product rule, quotient rule, differentiating exponentials, logs, trig, and implicit curves.",
    "Integration": year === "year1"
      ? "Fundamental Theorem of Calculus, indefinite/definite integration of xⁿ, and area under a curve."
      : "Integration by substitution, integration by parts, partial fractions integration, and differential equations.",
    "2D Vectors": "Working with column vectors, i and j notation, magnitudes, unit vectors, and displacement.",

    // Pure Year 2
    "Partial Fractions": "Decomposing rational expressions with linear and repeated algebraic denominators.",
    "Functions": "Domain and range, composite functions, inverse functions, and modulus graphs |y| = f(|x|).",
    "Sequences and Series": "Arithmetic and geometric progressions, sigma notation, and infinite convergent series.",
    "Radians": "Arc length, sector areas, and small-angle approximations (sin x ≈ x, cos x ≈ 1 - x²/2).",
    "Trigonometric Functions": "Secant, cosecant, and cotangent functions, inverse trig, and compound/double-angle formulae.",
    "Parametric Equations": "Converting parametric curves into cartesian form, curve sketching, and coordinate modeling.",
    "Numerical Methods": "Locating roots by sign changes, cobweb/staircase iterations, and the Newton-Raphson method.",
    "3D Vectors": "Extending vectors to three dimensions, distance formulas, and solving geometric spatial problems.",

    // Mechanics Year 1
    "Quantities and Units": "Working with SI units, distinguishing scalars from vectors, and foundational mechanics models.",
    "Kinematics": year === "year1"
      ? "Motion graphs, constant acceleration equations (SUVAT), and introduction to variable acceleration calculus."
      : "Motion in 2D under gravity, launching at angles, flight times, horizontal range, and trajectory paths.",
    "Forces and Newton's Laws": "Force diagrams, gravity, weight, normal reaction, applying F = ma, and equilibrium.",

    // Mechanics Year 2
    "Kinematics (Projectiles)": "Motion in 2D under gravity, launching at angles, flight times, horizontal range, and trajectory paths.",
    "Friction and Inclined Planes": "Resolving forces on slopes, calculating normal reaction, and friction bounds using F ≤ μR.",
    "Connected Particles": "Analyzing tension and acceleration in multi-particle systems, trailers, and pulleys.",
    "Rigid Body Moments": "The principle of moments, centers of gravity, and conditions for static equilibrium on beams and ladders.",

    // Statistics Year 1
    "Data Collection": "Understanding populations, sampling methods (random, systematic, quota, opportunity), and bias.",
    "Measures of Location and Spread": "Mean, median, mode, quartiles, percentiles, standard deviation, and variance calculations.",
    "Representations of Data": "Constructing and interpreting box plots, cumulative frequency graphs, and histograms.",
    "Correlation": "Linear regression lines, explanatory variables, and interpreting the product moment correlation coefficient (r).",
    "Probability": "Venn diagrams, tree diagrams, mutually exclusive events, independent events, and sample spaces.",
    "Statistical Distributions": "Discrete random variables, probability distributions, and the Binomial distribution framework.",
    "Binomial Hypothesis Testing": "Formulating null and alternative hypotheses, critical regions, and executing 1-tailed and 2-tailed tests.",

    // Statistics Year 2
    "Regression and Correlation": "Measuring exponential data trends using logarithms and conducting hypothesis tests for correlation.",
    "Conditional Probability": "Mastering conditional probability formula layouts, dependency rules, and advanced Venn/Tree mappings.",
    "The Normal Distribution": "Continuous random variables, normal curves, calculating probabilities, and standardizing values using Z.",
    "Normal Hypothesis Testing": "Conducting hypothesis tests for the mean of a Normal distribution using sample statistics.",
  };

  return descMap[title] ?? "Explore key exam insights, detailed revision notes, and timed practice sets.";
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
    description: getSubtopicDescriptionForBoard(title, board, course, year),
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
