import type { GameQuestion } from "./question-banks";

/** Challenging logic / maths puzzles for the home card (new users). */
const MIND_TEASER_BANK: Omit<GameQuestion, "id">[] = [
  {
    promptTex:
      "\\begin{aligned}&\\text{At exactly 3:15 on a 12-hour analogue clock, what is the}\\\\&\\text{smaller angle between the hour and minute hands, in degrees?}\\end{aligned}",
    acceptableAnswers: ["7.5", "7.5°", "15/2", "7.5degrees"],
    hint: "The hour hand moves with the minutes, not only on the hour.",
  },
  {
    promptTex:
      "\\begin{aligned}&\\text{How many 4-digit numbers can be formed using only the digits}\\\\&\\text{1, 2, 3, 4 with no two adjacent digits equal?}\\end{aligned}",
    acceptableAnswers: ["108"],
    hint: "Count choices position by position.",
  },
  {
    promptTex:
      "\\begin{aligned}&\\text{A rectangle has perimeter 56 and positive integer side lengths.}\\\\&\\text{What is the maximum possible area?}\\end{aligned}",
    acceptableAnswers: ["196"],
    hint: "For a fixed perimeter, which shape is closest to a square?",
  },
  {
    promptTex:
      "\\begin{aligned}&\\text{Three fair dice are rolled. What is the probability that}\\\\&\\text{all three show different numbers? Give your answer as a}\\\\&\\text{fraction in lowest terms (e.g. } 5/18\\text{).}\\end{aligned}",
    acceptableAnswers: ["5/18"],
    hint: "Count favourable outcomes over 6 cubed.",
  },
  {
    promptTex:
      "\\begin{aligned}&\\text{How many trailing zeros does } 100! \\text{ have?}\\end{aligned}",
    acceptableAnswers: ["24"],
    hint: "Count factors of 10 in the prime factorisation.",
  },
  {
    promptTex:
      "\\begin{aligned}&\\text{How many positive integers } n \\le 500 \\text{ are divisible by 7}\\\\&\\text{or 11 but not by both?}\\end{aligned}",
    acceptableAnswers: ["97"],
    hint: "Use inclusion–exclusion, then subtract the overlap.",
  },
  {
    promptTex:
      "\\begin{aligned}&\\text{Find the remainder when } 7^{2026} \\text{ is divided by } 11.\\end{aligned}",
    acceptableAnswers: ["5"],
    hint: "Use Fermat’s little theorem on primes.",
  },
  {
    promptTex:
      "\\begin{aligned}&\\text{A cube of edge 6 cm has a cylindrical hole of radius 2 cm}\\\\&\\text{drilled straight through its centre, axis parallel to an edge.}\\\\&\\text{What is the volume of the remaining solid? Give your answer}\\\\&\\text{in terms of } \\pi \\text{ (e.g. } 216-72\\pi\\text{).}\\end{aligned}",
    acceptableAnswers: [
      "216-72pi",
      "216-72π",
      "216-72*pi",
      "216 - 72pi",
    ],
    hint: "Subtract cylinder volume from cube volume.",
  },
];

export function getMindTeaserQuestion(rotationIndex: number): GameQuestion {
  const item = MIND_TEASER_BANK[rotationIndex % MIND_TEASER_BANK.length];
  return { ...item, id: `mind-teaser-home-${rotationIndex}` };
}
