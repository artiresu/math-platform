export type TopicId = "arithmetic" | "integrals" | "olympiad";

export type GameQuestion = {
  id: string;
  promptTex: string;
  acceptableAnswers: string[];
  hint?: string;
};

export const RACE_QUESTION_COUNT = 3;
export const RACE_WIN_POINTS = 2;

export const TOPICS: {
  id: TopicId;
  title: string;
  description: string;
  accent: string;
}[] = [
  {
    id: "arithmetic",
    title: "Speed Arithmetic",
    description: "60-second sprint — as many sums as you can.",
    accent: "from-cyan-500/20 to-teal-600/10 border-cyan-400/30",
  },
  {
    id: "integrals",
    title: "Integrals",
    description:
      "Solo: race through 3 hard integrals. Multiplayer: first correct answer wins each round — first to 2 points.",
    accent: "from-violet-500/20 to-indigo-600/10 border-violet-400/30",
  },
  {
    id: "olympiad",
    title: "Olympiad Questions",
    description:
      "Solo: solve 3 puzzles in a row as fast as you can. Multiplayer: first correct answer wins each round — first to 2 points.",
    accent: "from-amber-500/20 to-orange-600/10 border-amber-400/30",
  },
];

/** Harder A-Level / early university indefinite integrals */
const HARD_INTEGRAL_BANK: Omit<GameQuestion, "id">[] = [
  {
    promptTex: "\\displaystyle \\int e^x \\cos x \\, dx",
    acceptableAnswers: [
      "e^x(sinx+cosx)/2+c",
      "e^x(sin x+cos x)/2+c",
      "(e^x/2)(sinx+cosx)+c",
      "e^xsinx/2+e^xcosx/2+c",
    ],
    hint: "Integration by parts twice (or tabular).",
  },
  {
    promptTex: "\\displaystyle \\int x \\ln x \\, dx",
    acceptableAnswers: [
      "x^2lnx/2-x^2/4+c",
      "(x^2/2)lnx-x^2/4+c",
      "x^2(2lnx-1)/4+c",
    ],
    hint: "Let u = ln x.",
  },
  {
    promptTex: "\\displaystyle \\int \\frac{x^2}{x^2+1} \\, dx",
    acceptableAnswers: ["x-arctanx+c", "x-arctan(x)+c", "x-tan^-1x+c"],
    hint: "Rewrite the numerator.",
  },
  {
    promptTex: "\\displaystyle \\int \\frac{1}{x^2+4} \\, dx",
    acceptableAnswers: [
      "arctan(x/2)/2+c",
      "(1/2)arctan(x/2)+c",
      "tan^-1(x/2)/2+c",
    ],
  },
  {
    promptTex: "\\displaystyle \\int \\sin^2 x \\cos x \\, dx",
    acceptableAnswers: ["sin^3x/3+c", "sin(x)^3/3+c", "(sin^3x)/3+c"],
  },
  {
    promptTex: "\\displaystyle \\int \\frac{x}{\\sqrt{x+1}} \\, dx",
    acceptableAnswers: [
      "(2/3)(x+1)^(3/2)-2(x+1)^(1/2)+c",
      "2(x+1)^(3/2)/3-2(x+1)^(1/2)+c",
      "2/3(x+1)^(3/2)-2(x+1)^(1/2)+c",
    ],
    hint: "Substitute u = x + 1.",
  },
  {
    promptTex: "\\displaystyle \\int \\frac{3x+5}{x^2+x-2} \\, dx",
    acceptableAnswers: [
      "2ln|x+2|+ln|x-1|+c",
      "ln|(x+2)^2(x-1)|+c",
      "2ln(x+2)+ln(x-1)+c",
    ],
    hint: "Partial fractions.",
  },
  {
    promptTex: "\\displaystyle \\int x^2 e^x \\, dx",
    acceptableAnswers: [
      "e^x(x^2-2x+2)+c",
      "(x^2-2x+2)e^x+c",
      "e^x(x^2-2x+2)+c",
    ],
    hint: "Integration by parts twice.",
  },
  {
    promptTex: "\\displaystyle \\int \\sec^2 x \\tan x \\, dx",
    acceptableAnswers: ["tan^2x/2+c", "sec^2x/2-1/2+c", "(tanx)^2/2+c"],
  },
];

const OLYMPIAD_RACE_BANK: Omit<GameQuestion, "id">[] = [
  {
    promptTex:
      "\\text{How many positive integers } n < 1000 \\text{ are divisible by } 7 \\text{ but not by } 3?",
    acceptableAnswers: ["95"],
    hint: "Count multiples of 7, subtract those also divisible by 21.",
  },
  {
    promptTex:
      "\\text{What is the remainder when } 2^{100} \\text{ is divided by } 7?",
    acceptableAnswers: ["2"],
    hint: "Use Fermat: powers of 2 mod 7 cycle.",
  },
  {
    promptTex:
      "\\text{How many 3-digit integers have digits in strictly increasing order?}",
    acceptableAnswers: ["84"],
  },
  {
    promptTex:
      "\\text{Find the number of positive divisors of } 360.",
    acceptableAnswers: ["24"],
  },
  {
    promptTex:
      "\\text{If } \\binom{n}{2}=45, \\text{ what is } n?",
    acceptableAnswers: ["10"],
  },
  {
    promptTex:
      "\\text{How many ways can 8 people sit in a row if two specific people must not sit next to each other?}",
    acceptableAnswers: ["30240"],
    hint: "Total arrangements minus adjacent pairs.",
  },
  {
    promptTex:
      "\\text{What is the sum of all positive integers } k \\text{ with } \\gcd(k,30)=1 \\text{ and } k \\leq 30?",
    acceptableAnswers: ["240"],
  },
  {
    promptTex:
      "\\text{How many solutions in non-negative integers to } x+y+z=10?",
    acceptableAnswers: ["66"],
    hint: "Stars and bars.",
  },
  {
    promptTex:
      "\\text{What is the units digit of } 3^{2025}?",
    acceptableAnswers: ["3"],
  },
];

export function normalizeAnswer(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/·/g, "*")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/\+c\b/g, "+c")
    .replace(/const/g, "c");
}

export function isCorrectAnswer(
  userInput: string,
  acceptableAnswers: string[],
): boolean {
  const normalized = normalizeAnswer(userInput);
  if (!normalized) return false;
  return acceptableAnswers.some(
    (a) => normalizeAnswer(a) === normalized,
  );
}

export function isRaceTopic(topic: TopicId): boolean {
  return topic === "integrals" || topic === "olympiad";
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function withIds(items: Omit<GameQuestion, "id">[], prefix: string): GameQuestion[] {
  return items.map((item, i) => ({
    ...item,
    id: `${prefix}-${i}-${Date.now()}`,
  }));
}

export function buildHardIntegralSet(): GameQuestion[] {
  return withIds(
    shuffle(HARD_INTEGRAL_BANK).slice(0, RACE_QUESTION_COUNT),
    "integral",
  );
}

export function buildOlympiadSet(): GameQuestion[] {
  return withIds(
    shuffle(OLYMPIAD_RACE_BANK).slice(0, RACE_QUESTION_COUNT),
    "olympiad",
  );
}

export function buildRaceQuestionSet(topic: TopicId): GameQuestion[] {
  if (topic === "integrals") return buildHardIntegralSet();
  if (topic === "olympiad") return buildOlympiadSet();
  return [];
}

type ArithmeticOp = "+" | "-" | "*" | "/";

function pickOp(): ArithmeticOp {
  const ops: ArithmeticOp[] = ["+", "-", "*", "/"];
  return ops[randInt(0, ops.length - 1)];
}

function randIntSeeded(seed: number, min: number, max: number) {
  return Math.floor(mulberry32(seed)() * (max - min + 1)) + min;
}

function pickOpSeeded(seed: number): ArithmeticOp {
  const ops: ArithmeticOp[] = ["+", "-", "*", "/"];
  return ops[randIntSeeded(seed, 0, ops.length - 1)];
}

/** Deterministic arithmetic question for a given rotation index (home daily sample). */
export function generateArithmeticQuestionSeeded(rotationIndex: number): GameQuestion {
  const seed = rotationIndex * 7919 + 104729;
  const op = pickOpSeeded(seed);
  let a = randIntSeeded(seed + 1, 2, 99);
  let b = randIntSeeded(seed + 2, 2, 99);
  let answer = 0;
  let promptTex = "";

  switch (op) {
    case "+":
      answer = a + b;
      promptTex = `${a} + ${b} = \\; ?`;
      break;
    case "-":
      if (b > a) [a, b] = [b, a];
      answer = a - b;
      promptTex = `${a} - ${b} = \\; ?`;
      break;
    case "*":
      a = randIntSeeded(seed + 3, 2, 24);
      b = randIntSeeded(seed + 4, 2, 15);
      answer = a * b;
      promptTex = `${a} \\times ${b} = \\; ?`;
      break;
    case "/": {
      b = randIntSeeded(seed + 5, 2, 12);
      answer = randIntSeeded(seed + 6, 2, 12);
      a = b * answer;
      promptTex = `${a} \\div ${b} = \\; ?`;
      break;
    }
  }

  return {
    id: `arith-home-${rotationIndex}`,
    promptTex,
    acceptableAnswers: [String(answer)],
  };
}

function bankQuestion(
  item: Omit<GameQuestion, "id">,
  prefix: string,
  index: number,
): GameQuestion {
  return { ...item, id: `${prefix}-home-${index}` };
}

/** Sample question for home page — rotationIndex changes daily and after each answer. */
export function getHomeGameQuestion(
  topic: "speed-arithmetic" | "integrals" | "olympiad",
  rotationIndex: number,
): GameQuestion {
  if (topic === "speed-arithmetic") {
    return generateArithmeticQuestionSeeded(rotationIndex);
  }
  if (topic === "integrals") {
    const item = HARD_INTEGRAL_BANK[rotationIndex % HARD_INTEGRAL_BANK.length];
    return bankQuestion(item, "integral", rotationIndex);
  }
  const item = OLYMPIAD_RACE_BANK[rotationIndex % OLYMPIAD_RACE_BANK.length];
  return bankQuestion(item, "olympiad", rotationIndex);
}

export function generateArithmeticQuestion(): GameQuestion {
  const op = pickOp();
  let a = randInt(2, 99);
  let b = randInt(2, 99);
  let answer = 0;
  let promptTex = "";

  switch (op) {
    case "+":
      answer = a + b;
      promptTex = `${a} + ${b} = \\; ?`;
      break;
    case "-":
      if (b > a) [a, b] = [b, a];
      answer = a - b;
      promptTex = `${a} - ${b} = \\; ?`;
      break;
    case "*":
      a = randInt(2, 24);
      b = randInt(2, 15);
      answer = a * b;
      promptTex = `${a} \\times ${b} = \\; ?`;
      break;
    case "/": {
      b = randInt(2, 12);
      answer = randInt(2, 12);
      a = b * answer;
      promptTex = `${a} \\div ${b} = \\; ?`;
      break;
    }
  }

  return {
    id: `arith-${Date.now()}-${Math.random()}`,
    promptTex,
    acceptableAnswers: [String(answer)],
  };
}

export function generateQuestion(_topic: TopicId): GameQuestion {
  return generateArithmeticQuestion();
}
