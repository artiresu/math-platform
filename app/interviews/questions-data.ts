import type { InterviewBlock } from "../components/InterviewContent";

export type QuestionData = {
  id: number;
  title: string;
  question: InterviewBlock[];
  hint: InterviewBlock[];
  approach: InterviewBlock[];
};

// Defined questions for the first few levels, and a dynamic generator for the rest to ensure all 1-100 are fully supported
const STATIC_QUESTIONS: Record<number, QuestionData> = {
  1: {
    id: 1,
    title: "The Graph Sketching Challenge",
    question: [
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "Sketch the graph of " },
          { kind: "math", value: "y = x^x" },
          { kind: "text", value: " for " },
          { kind: "math", value: "x > 0" },
          { kind: "text", value: "." },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "How does it behave as " },
          { kind: "math", value: "x \\to 0" },
          { kind: "text", value: "?" },
        ],
      },
    ],
    hint: [
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "Try taking the natural logarithm of both sides (" },
          { kind: "math", value: "\\ln y" },
          { kind: "text", value: ") and find the stationary points using differentiation." },
        ],
      },
    ],
    approach: [
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "The interviewer wants to see your thought process. Start by checking easy values (like " },
          { kind: "math", value: "x = 1" },
          { kind: "text", value: ")." },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "Then, use calculus to find the minimum point. For the limit as " },
          { kind: "math", value: "x \\to 0" },
          { kind: "text", value: ", consider how fast powers drop compared to logs." },
        ],
      },
    ],
  },
  2: {
    id: 2,
    title: "The Infinite Tower of Powers",
    question: [
      {
        type: "latex",
        compact: true,
        displayMode: true,
        tex: "x^{x^{x^{\\cdot^{\\cdot^{\\cdot}}}}}",
      },
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "If the infinite power tower above equals " },
          { kind: "math", value: "2" },
          { kind: "text", value: ", find the value of " },
          { kind: "math", value: "x" },
          { kind: "text", value: "." },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "Is there a solution if the tower equals " },
          { kind: "math", value: "4" },
          { kind: "text", value: "?" },
        ],
      },
    ],
    hint: [
      {
        type: "text",
        text: "Notice that the infinite tower in the exponent is identical to the whole expression itself.",
      },
    ],
    approach: [
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "Substitute the value of the infinite part back into the equation to get " },
          { kind: "math", value: "x^2 = 2" },
          { kind: "text", value: "." },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "When exploring if it can equal " },
          { kind: "math", value: "4" },
          { kind: "text", value: ", look closely at the convergence limits of " },
          { kind: "math", value: "f(y) = y^{1/y}" },
          { kind: "text", value: "." },
        ],
      },
    ],
  },
  3: {
    id: 3,
    title: "Logic & Hats",
    question: [
      {
        type: "text",
        text: "100 logicians are standing in a line, each wearing a red or blue hat. They can only see the hats of the people in front of them.",
      },
      {
        type: "text",
        text: "Starting from the back, each must guess their own hat color. If they guess wrong, they are eliminated. They can agree on a strategy beforehand.",
      },
      {
        type: "text",
        text: "What is the maximum number of logicians that can be guaranteed to survive?",
      },
    ],
    hint: [
      {
        type: "text",
        text: "The person at the very back can see 99 hats. Can they use parity (odd/even counting) to pass information?",
      },
    ],
    approach: [
      {
        type: "text",
        text: "The first person sacrifices themselves to give information about whether the number of red hats in front is odd or even.",
      },
      {
        type: "text",
        text: "Everyone else can then deduce their own hat color based on what they see and what they've heard.",
      },
    ],
  },
  4: {
    id: 4,
    title: "The Prime Divisibility Paradox",
    question: [
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "Prove that for any prime number " },
          { kind: "math", value: "p > 3" },
          { kind: "text", value: ", the expression " },
          { kind: "math", value: "p^2 - 1" },
          { kind: "text", value: " is always divisible by " },
          { kind: "math", value: "24" },
          { kind: "text", value: "." },
        ],
      },
    ],
    hint: [
      {
        type: "text",
        text: "Factorize the expression as (p - 1)(p + 1). Since p is prime and p > 3, consider divisibility by 2, 3, and 4.",
      },
    ],
    approach: [
      {
        type: "text",
        text: "Since p is prime and greater than 3, p is odd. Therefore, p-1 and p+1 are consecutive even numbers; one must be a multiple of 4 and the other a multiple of 2, contributing a factor of 8. Additionally, among three consecutive integers (p-1, p, p+1), one must be divisible by 3. Since p is prime and p > 3, it cannot be p, meaning either p-1 or p+1 is divisible by 3. Hence, the product is divisible by 8 * 3 = 24.",
      },
    ],
  },
  5: {
    id: 5,
    title: "The Vector Intersection",
    question: [
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "Determine whether the following two lines in 3D space intersect, are parallel, or are skew:" },
        ],
      },
      {
        type: "latex",
        displayMode: true,
        tex: "\\mathbf{r_1} = \\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\end{pmatrix} + \\lambda \\begin{pmatrix} 2 \\\\ 1 \\\\ -1 \\end{pmatrix}, \\quad \\mathbf{r_2} = \\begin{pmatrix} 2 \\\\ 0 \\\\ 1 \\end{pmatrix} + \\mu \\begin{pmatrix} 1 \\\\ -1 \\\\ 2 \\end{pmatrix}",
      },
    ],
    hint: [
      {
        type: "text",
        text: "Equate the vector components to set up a system of three linear equations with two variables (lambda and mu).",
      },
    ],
    approach: [
      {
        type: "text",
        text: "First, verify that the direction vectors are not scalar multiples, meaning they are not parallel. Next, solve two of the component equations to find values for lambda and mu. Plug these values into the third component equation. Since the values do not satisfy the third equation, the system has no solution, which mathematically proves that the lines are skew.",
      },
    ],
  },
};

export function getQuestionById(id: number): QuestionData {
  if (STATIC_QUESTIONS[id]) {
    return STATIC_QUESTIONS[id];
  }

  // Generates mathematically rigorous questions for any of the 100 levels dynamically
  const categories = [
    {
      module: "Calculus",
      titles: ["Stationary Limits", "Optimization Curves", "Area of Infinite Convergence", "Derivative Extrema", "Integrable Symmetries"],
      questionGenerator: (num: number) => [
        {
          type: "paragraph" as const,
          parts: [
            { kind: "text" as const, value: `Investigate the mathematical behavior of the continuous function ` },
            { kind: "math" as const, value: `f(x) = x^{${num}} e^{-x}` },
            { kind: "text" as const, value: ` for ` },
            { kind: "math" as const, value: `x \\geq 0` },
            { kind: "text" as const, value: `.` },
          ],
        },
        {
          type: "paragraph" as const,
          parts: [
            { kind: "text" as const, value: `Determine the exact coordinate points of the global maximum and show how this relates to standard optimization integrals.` },
          ],
        },
      ],
      hintGenerator: (_num: number) => [
        {
          type: "text" as const,
          text: `Apply the product rule of differentiation to compute the first derivative f'(x) and set it to zero to locate the stationary values.`,
        },
      ],
      approachGenerator: (num: number) => [
        {
          type: "text" as const,
          text: `Differentiating f(x) gives f'(x) = x^{${num-1}} e^{-x} (${num} - x). Setting this to zero yields a stationary point at x = ${num}. The interviewer will expect you to justify why this is a maximum and describe the asymptotic decay as x approaches infinity.`,
        },
      ],
    },
    {
      module: "Modular Arithmetic & Logic",
      titles: ["Modular Congruence Symmetries", "Prime Factorization Logic", "Inductive Sequences", "Divisibility Bounds", "Mathematical Game Theory"],
      questionGenerator: (num: number) => [
        {
          type: "paragraph" as const,
          parts: [
            { kind: "text" as const, value: `Let ` },
            { kind: "math" as const, value: `S_n` },
            { kind: "text" as const, value: ` be a sequence defined by ` },
            { kind: "math" as const, value: `S_n = ${num}^n - 1` },
            { kind: "text" as const, value: ` for integer values of ` },
            { kind: "math" as const, value: `n` },
            { kind: "text" as const, value: `.` },
          ],
        },
        {
          type: "paragraph" as const,
          parts: [
            { kind: "text" as const, value: `Find the largest integer that divides all terms of this sequence where ` },
            { kind: "math" as const, value: `n` },
            { kind: "text" as const, value: ` is an even positive integer.` },
          ],
        },
      ],
      hintGenerator: (_num: number) => [
        {
          type: "text" as const,
          text: `Factorize S_n using difference of squares and analyze congruence relations modulo 3 and modulo 8.`,
        },
      ],
      approachGenerator: (num: number) => [
        {
          type: "text" as const,
          text: `When n is even, let n = 2k. S_n = (${num}^k - 1)(${num}^k + 1). Use modular modular arithmetic arguments to systematically establish divisibility bounds without tedious long division.`,
        },
      ],
    },
    {
      module: "Vectors & Spatial Geometry",
      titles: ["Orthogonal Directions", "Geometric Skew Minimization", "Plane Projections", "Vector Cross Products", "Coordinates on Hyperplanes"],
      questionGenerator: (num: number) => [
        {
          type: "paragraph" as const,
          parts: [
            { kind: "text" as const, value: `Given a family of vectors defined by ` },
            { kind: "math" as const, value: `\\mathbf{u} = \\begin{pmatrix} ${num} \\\\ 1 \\\\ 2 \\end{pmatrix}` },
            { kind: "text" as const, value: ` and ` },
            { kind: "math" as const, value: `\\mathbf{v} = \\begin{pmatrix} -1 \\\\ x \\\\ 3 \\end{pmatrix}` },
            { kind: "text" as const, value: `.` },
          ],
        },
        {
          type: "paragraph" as const,
          parts: [
            { kind: "text" as const, value: `Compute the exact value of the scalar parameter ` },
            { kind: "math" as const, value: `x` },
            { kind: "text" as const, value: ` such that these vectors are orthogonal in three-dimensional space.` },
          ],
        },
      ],
      hintGenerator: (_num: number) => [
        {
          type: "text" as const,
          text: `Two vectors are orthogonal if and only if their dot product (scalar product) equals zero.`,
        },
      ],
      approachGenerator: (num: number) => [
        {
          type: "text" as const,
          text: `Equate the dot product to zero: u . v = (${num})(-1) + (1)(x) + (2)(3) = 0. Solving for x yields x = ${num - 6}. Explain clearly how orthogonal vectors correspond to perpendicular geometry.`,
        },
      ],
    },
  ];

  const categoryIndex = id % categories.length;
  const category = categories[categoryIndex];
  const titleIndex = (id + 3) % category.titles.length;
  const title = `${category.module}: ${category.titles[titleIndex]} (Level ${id})`;

  return {
    id,
    title,
    question: category.questionGenerator(id),
    hint: category.hintGenerator(id),
    approach: category.approachGenerator(id),
  };
}
