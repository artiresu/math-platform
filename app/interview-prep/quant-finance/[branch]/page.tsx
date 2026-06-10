"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { CollapsibleReveal } from "../../../components/CollapsibleReveal";
import { InterviewContent, type InterviewBlock } from "../../../components/InterviewContent";
import { PageShell } from "../../../components/PageShell";

type Question = {
  id: string;
  difficulty: "easy" | "intermediate" | "hard";
  title: string;
  question: InterviewBlock[];
  hint: InterviewBlock[];
  approach: InterviewBlock[];
  correctAnswer?: string; // Standardized short answer for validation
};

type Topic = {
  id: string;
  title: string;
  description: string;
  easy: Question;
  intermediate: Question;
  hard: Question;
};

type BranchData = {
  id: string;
  title: string;
  description: string;
  icon: string;
  topics: Topic[];
};

// Fixed database of quantitative topics and questions
const BRANCH_DATABASE: Record<string, BranchData> = {
  logic: {
    id: "logic",
    title: "Logic",
    description: "Brainteasers, induction, hat puzzles, and logical deductions.",
    icon: "🧠",
    topics: [
      {
        id: "logic-coins",
        title: "Coin Flipping & Probability",
        description: "Explore probability spaces and biased coin hypothesis testing.",
        easy: {
          id: "logic-coin-easy",
          difficulty: "easy",
          title: "Biased coin detection",
          question: [{ type: "text", text: "You flip a coin 10 times and get 7 heads. Your colleague claims the coin is biased toward heads. What is the exact probability (p-value) of getting 7 or more heads with a fair coin? (Format as decimal, e.g. 0.172)" }],
          hint: [{ type: "text", text: "Compute the sum of binomial probabilities for 7, 8, 9, and 10 heads with n = 10 and p = 0.5." }],
          approach: [{ type: "text", text: "P(X >= 7) = C(10,7)(0.5)^10 + C(10,8)(0.5)^10 + C(10,9)(0.5)^10 + C(10,10)(0.5)^10 = (120 + 45 + 10 + 1) / 1024 = 176/1024 = 0.171875. Since 0.172 > 0.05, we cannot reject the null hypothesis of a fair coin." }],
          correctAnswer: "0.172"
        },
        intermediate: {
          id: "logic-coin-intermediate",
          difficulty: "intermediate",
          title: "The Monty Hall Dilemma",
          question: [{ type: "text", text: "You are on a game show and pick Door 1. The host (who knows what is behind the doors) opens Door 3 to reveal a goat. He asks if you want to switch to Door 2. What is the probability of winning if you switch? (Format as a fraction, e.g. 2/3)" }],
          hint: [{ type: "text", text: "Calculate the probability that your initial choice was wrong." }],
          approach: [{ type: "text", text: "Switching gives you a 2/3 probability of winning. Your initial pick (Door 1) had a 1/3 chance of winning. The remaining 2/3 probability stays with Door 2 since the host intentionally opened a goat door." }],
          correctAnswer: "2/3"
        },
        hard: {
          id: "logic-coin-hard",
          difficulty: "hard",
          title: "Infinite Coin Game",
          question: [{ type: "text", text: "A and B take turns flipping a fair coin. A wins on Heads; B wins on Tails. A flips first. What is the probability that player A wins? (Format as a fraction, e.g. 2/3)" }],
          hint: [{ type: "text", text: "Write the recursive equation: A wins if A flips Heads OR (A flips Tails and B loses)." }],
          approach: [{ type: "text", text: "Let p be A's win probability. p = 1/2 + 1/2 * (1 - p). Solving gives p = 1/2 + 1/2 - 1/2p => 1.5p = 1 => p = 2/3." }],
          correctAnswer: "2/3"
        }
      },
      {
        id: "logic-hats",
        title: "Hat & Prisoner Puzzles",
        description: "Solve classic game theory and cooperative deduction puzzles.",
        easy: {
          id: "logic-hats-easy",
          difficulty: "easy",
          title: "Two prisoners, two hats",
          question: [{ type: "text", text: "Two prisoners face each other, each wearing a red or blue hat. Each sees the other's hat but not their own. They must simultaneously guess their own hat color. If at least one is correct, they are freed. What is the guaranteed winning strategy? (Specify who guesses opposite, e.g. 'One guesses same, one guesses opposite')" }],
          hint: [{ type: "text", text: "Consider how to cover all 4 combinations (RR, RB, BR, BB) such that exactly one person is correct." }],
          approach: [{ type: "text", text: "Prisoner A guesses that their hat is the SAME color as Prisoner B's. Prisoner B guesses that their hat is the OPPOSITE color of Prisoner A's. If hats are same (RR, BB), A is correct. If hats are opposite (RB, BR), B is correct. In all cases, exactly one guesses right." }],
          correctAnswer: "One guesses same, one guesses opposite"
        },
        intermediate: {
          id: "logic-hats-intermediate",
          difficulty: "intermediate",
          title: "100 prisoners in a line",
          question: [{ type: "text", text: "100 prisoners stand in a single-file line. Each wears a red or blue hat and can see the hats in front of them. The 100th prisoner (at the back) starts guessing his hat color, followed by the 99th, and so on. What is the maximum number of prisoners guaranteed to be saved? (Type a number)" }],
          hint: [{ type: "text", text: "The 100th prisoner can use his guess to communicate the parity of blue hats he sees." }],
          approach: [{ type: "text", text: "99 prisoners are guaranteed to be saved. The 100th prisoner counts the blue hats in front of him. He says 'Blue' if the count is odd, and 'Red' if the count is even. Every subsequent prisoner compares the parity of blue hats they see to the running parity, deducing their own color." }],
          correctAnswer: "99"
        },
        hard: {
          id: "logic-hats-hard",
          difficulty: "hard",
          title: "The 100 prisoners and boxes",
          question: [{ type: "text", text: "100 numbered prisoners can each open up to 50 of 100 closed boxes containing random numbers from 1 to 100. If everyone finds their own number, they are freed. What is the success probability of the optimal loop-following strategy? (Format as percentage, e.g. 31%)" }],
          hint: [{ type: "text", text: "Every box points to another box, forming loops. What is the probability that a random permutation contains no loops of length greater than 50?" }],
          approach: [{ type: "text", text: "The loop-following strategy gives a ~31.18% chance of success. Each prisoner starts by opening the box corresponding to their own number, and opens boxes pointing to the next number. The probability that a random permutation contains a cycle of length > 50 is ln(2), so survival rate is 1 - ln(2) = 31.18%." }],
          correctAnswer: "31%"
        }
      }
    ]
  },
  maths: {
    id: "maths",
    title: "Complex Maths",
    description: "Probability distributions, expected value, calculus, and linear algebra.",
    icon: "∑",
    topics: [
      {
        id: "maths-calculus",
        title: "Calculus & Integrals",
        description: "Solve key analytical integration techniques used in quant modeling.",
        easy: {
          id: "maths-calc-easy",
          difficulty: "easy",
          title: "Integral of ln(x)",
          question: [{ type: "text", text: "Evaluate the definite integral of ln(x) dx from 1 to e. (Type a single integer)" }],
          hint: [{ type: "text", text: "Use integration by parts: u = ln(x) and dv = dx." }],
          approach: [{ type: "text", text: "Integral of ln(x) dx = x*ln(x) - x. Evaluated from 1 to e: (e*ln(e) - e) - (1*ln(1) - 1) = (e - e) - (0 - 1) = 1." }],
          correctAnswer: "1"
        },
        intermediate: {
          id: "maths-calc-intermediate",
          difficulty: "intermediate",
          title: "Gaussian Integral",
          question: [{ type: "text", text: "Evaluate the integral from -infinity to +infinity of e^(-x^2) dx. (Format as sqrt(symbol), e.g. sqrt(pi))" }],
          hint: [{ type: "text", text: "Square the integral and switch to polar coordinates (r, theta) in 2D." }],
          approach: [{ type: "text", text: "Let I = integral e^(-x^2) dx. I^2 = double integral e^(-(x^2+y^2)) dx dy = integral_0^2pi dtheta integral_0^inf r e^(-r^2) dr = 2pi * (1/2) = pi. Thus, I = sqrt(pi)." }],
          correctAnswer: "sqrt(pi)"
        },
        hard: {
          id: "maths-calc-hard",
          difficulty: "hard",
          title: "The Dirichlet Integral",
          question: [{ type: "text", text: "Compute the exact value of the integral from 0 to infinity of sin(x)/x dx. (Format as fraction, e.g. pi/2)" }],
          hint: [{ type: "text", text: "Use Feynman's integration trick (differentiation under the integral sign) with I(t) = integral e^(-tx) sin(x)/x dx." }],
          approach: [{ type: "text", text: "I'(t) = -integral_0^inf e^(-tx) sin(x) dx = -1/(t^2+1). Integrating gives I(t) = -arctan(t) + C. Since I(inf) = 0, C = pi/2. Thus, I(0) = pi/2." }],
          correctAnswer: "pi/2"
        }
      },
      {
        id: "maths-ev",
        title: "Expected Value & Games",
        description: "Compute game theory expectations and understand ruin risk.",
        easy: {
          id: "maths-ev-easy",
          difficulty: "easy",
          title: "Expected value of rolling two dice",
          question: [{ type: "text", text: "What is the expected value of the sum of rolling two fair six-sided dice? (Type a single integer)" }],
          hint: [{ type: "text", text: "Use linearity of expectation: E[X + Y] = E[X] + E[Y]." }],
          approach: [{ type: "text", text: "E[X] of a single die is (1+2+3+4+5+6)/6 = 3.5. Expected sum of two dice is 3.5 + 3.5 = 7." }],
          correctAnswer: "7"
        },
        intermediate: {
          id: "maths-ev-intermediate",
          difficulty: "intermediate",
          title: "Expected value trade-off",
          question: [{ type: "text", text: "A trading game wins £200 with probability 0.4 and loses £100 with probability 0.6. What is the expected value? (Type an integer)" }],
          hint: [{ type: "text", text: "EV = (win amount * win probability) - (loss amount * loss probability)." }],
          approach: [{ type: "text", text: "EV = 0.4 * 200 - 0.6 * 100 = 80 - 60 = £20. The trade-off is positive EV, but watch out for drawdown if bankroll is low." }],
          correctAnswer: "20"
        },
        hard: {
          id: "maths-ev-hard",
          difficulty: "hard",
          title: "St. Petersburg Paradox",
          question: [{ type: "text", text: "A coin is flipped until Heads appears. If heads is on the n-th flip, you get 2^n dollars. What is the theoretical expected value? (Type in lowercase, e.g. infinity)" }],
          hint: [{ type: "text", text: "Calculate Sum_{n=1}^infinity (probability of ending at flip n * payout at flip n)." }],
          approach: [{ type: "text", text: "EV = Sum_{n=1}^inf (1/2^n) * 2^n = Sum 1 = 1 + 1 + 1 + ... = infinity. Infinite expectation exists in theory, but in practice, utility is bounded." }],
          correctAnswer: "infinity"
        }
      }
    ]
  },
  coding: {
    id: "coding",
    title: "Coding/Data",
    description: "Algorithms, complexity, rolling correlation, and data architecture.",
    icon: "</>",
    topics: [
      {
        id: "coding-algo",
        title: "Algorithms & Complexity",
        description: "Analyze complexity and dynamic programming optimizations.",
        easy: {
          id: "coding-algo-easy",
          difficulty: "easy",
          title: "Two Sum Complexity",
          question: [{ type: "text", text: "What is the optimal time complexity to find two indices in an unsorted array that sum to a target? (Format as O(symbol), e.g. O(n))" }],
          hint: [{ type: "text", text: "You can keep track of seen elements using a hash set as you traverse the array." }],
          approach: [{ type: "text", text: "Using a hash map, we iterate once and look up target - x. Average time complexity is O(n), and space complexity is O(n)." }],
          correctAnswer: "O(n)"
        },
        intermediate: {
          id: "coding-algo-intermediate",
          difficulty: "intermediate",
          title: "Memoization vs Naive Fibonacci",
          question: [{ type: "text", text: "What is the time complexity of top-down memoized Fibonacci compared to naive recursive Fibonacci? (Format as O(n) vs O(2^n))" }],
          hint: [{ type: "text", text: "Memoization avoids recalculating overlapping subproblems by saving them in a table." }],
          approach: [{ type: "text", text: "Naive recursive fibonacci is O(2^n) due to redundant calculations. Memoization reduces it to O(n) since each Fibonacci state is calculated exactly once." }],
          correctAnswer: "O(n) vs O(2^n)"
        },
        hard: {
          id: "coding-algo-hard",
          difficulty: "hard",
          title: "Maximum Flow Complexity",
          question: [{ type: "text", text: "What is the worst-case time complexity of the Ford-Fulkerson algorithm for max flow with integer capacities and max flow f? (Use E for edges, f for flow, e.g. O(E * f))" }],
          hint: [{ type: "text", text: "Each augmenting path increases flow by at least 1 unit, and finding a path takes O(E) time using DFS/BFS." }],
          approach: [{ type: "text", text: "In the worst case, each step increases flow by 1. Staging augmenting paths takes O(E) and the number of steps is bounded by f, so worst-case time complexity is O(E * f)." }],
          correctAnswer: "O(E * f)"
        }
      },
      {
        id: "coding-stats",
        title: "Statistics & Time Series",
        description: "Inspect correlation lag and stationary time series.",
        easy: {
          id: "coding-stats-easy",
          difficulty: "easy",
          title: "Rolling Correlation Window Lag",
          question: [{ type: "text", text: "If you compute rolling correlation over a 20-day window, how many trading days of lag are introduced in detecting a sudden shift in correlation? (Type a number)" }],
          hint: [{ type: "text", text: "A rolling average centered window introduces approximately N/2 days of lag." }],
          approach: [{ type: "text", text: "Since a rolling window of size N averages information over the period, a sudden shift is detected with a lag of approximately N/2 = 10 days." }],
          correctAnswer: "10"
        },
        intermediate: {
          id: "coding-stats-intermediate",
          difficulty: "intermediate",
          title: "Spurious Correlation",
          question: [{ type: "text", text: "Regressing two independent random walks yields a high R-squared. What statistical property of random walks causes this? (Type in lowercase, e.g. non-stationarity)" }],
          hint: [{ type: "text", text: "The variance of a random walk grows with time, meaning the series contains a unit root." }],
          approach: [{ type: "text", text: "Non-stationarity (or a unit root) violates standard OLS assumptions. The trends in random walks do not average out, leading to spurious correlation with inflated t-stats." }],
          correctAnswer: "non-stationarity"
        },
        hard: {
          id: "coding-stats-hard",
          difficulty: "hard",
          title: "AR(1) Stationarity",
          question: [{ type: "text", text: "For the model X_t = phi * X_{t-1} + e_t, what is the boundary condition on phi for the process to be stationary? (Format as abs(phi) < 1)" }],
          hint: [{ type: "text", text: "Find the variance of X_t and verify what condition makes it positive and finite." }],
          approach: [{ type: "text", text: "Var(X_t) = phi^2 * Var(X_{t-1}) + sig^2. Under stationarity, Var(X_t) = sig^2 / (1 - phi^2). For this to be finite and positive, phi^2 < 1, which means abs(phi) < 1." }],
          correctAnswer: "abs(phi) < 1"
        }
      }
    ]
  },
  finance: {
    id: "finance",
    title: "Finance",
    description: "No-arbitrage option pricing, market structures, and trading heuristics.",
    icon: "£",
    topics: [
      {
        id: "finance-pricing",
        title: "Option Pricing & Derivatives",
        description: "Analyze option bounds and arbitrage pricing relations.",
        easy: {
          id: "finance-price-easy",
          difficulty: "easy",
          title: "Put-Call Parity",
          question: [{ type: "text", text: "For a European option, Call is 8, Put is 5, stock price is 100, and strike is 100. What is the implied discount factor e^(-rT)? (Format as decimal, e.g. 0.97)" }],
          hint: [{ type: "text", text: "Use the Put-Call parity formula: C - P = S - K * e^(-rT)." }],
          approach: [{ type: "text", text: "C - P = S - K * e^(-rT) => 8 - 5 = 100 - 100 * e^(-rT) => 3 = 100(1 - e^(-rT)) => e^(-rT) = 0.97." }],
          correctAnswer: "0.97"
        },
        intermediate: {
          id: "finance-price-intermediate",
          difficulty: "intermediate",
          title: "Option Bounds",
          question: [{ type: "text", text: "European call option C can never be priced lower than S - K * e^(-rT). If it were, what activity would restore pricing bounds? (Type in lowercase, e.g. arbitrage)" }],
          hint: [{ type: "text", text: "Market participants exploit price misalignments to earn risk-free returns." }],
          approach: [{ type: "text", text: "Arbitrage. If C < S - K * e^(-rT), you buy the call, borrow K * e^(-rT), and short the stock. This yields a guaranteed risk-free profit today and non-negative payouts at expiration." }],
          correctAnswer: "arbitrage"
        },
        hard: {
          id: "finance-price-hard",
          difficulty: "hard",
          title: "Black-Scholes PDE Boundary",
          question: [{ type: "text", text: "What is the boundary condition for a European put option price V(S, T) at expiration T with strike K? (Format using max(a, b), e.g. max(K - S, 0))" }],
          hint: [{ type: "text", text: "At expiration, the put option has only its intrinsic payoff value." }],
          approach: [{ type: "text", text: "At expiration, the holder either sells the stock at strike K if S < K, or lets it expire. Payoff is max(K - S, 0)." }],
          correctAnswer: "max(K - S, 0)"
        }
      },
      {
        id: "finance-risk",
        title: "Money Management & Risk",
        description: "Apply Kelly Criterion to determine optimal trading leverage.",
        easy: {
          id: "finance-risk-easy",
          difficulty: "easy",
          title: "Kelly Criterion 1-to-1",
          question: [{ type: "text", text: "You play a coin flip game that pays 1-to-1 on Heads and loses your bet on Tails. Heads probability is 0.6. What fraction of your bankroll should you bet under Kelly? (Format as decimal, e.g. 0.2)" }],
          hint: [{ type: "text", text: "The Kelly formula for 1-to-1 odds is f* = 2p - 1." }],
          approach: [{ type: "text", text: "f* = 2p - 1 = 2 * 0.6 - 1 = 1.2 - 1 = 0.2, or 20% of your bankroll." }],
          correctAnswer: "0.2"
        },
        intermediate: {
          id: "finance-risk-intermediate",
          difficulty: "intermediate",
          title: "Kelly Criterion General",
          question: [{ type: "text", text: "A trading strategy pays 2-to-1 (b = 2) with win probability p = 0.4 and loses 1-to-1 (q = 0.6) otherwise. What fraction of bankroll should you bet? (Format as decimal, e.g. 0.1)" }],
          hint: [{ type: "text", text: "The general Kelly Criterion is f* = (b * p - q) / b." }],
          approach: [{ type: "text", text: "f* = (2 * 0.4 - 0.6) / 2 = (0.8 - 0.6) / 2 = 0.2 / 2 = 0.1, or 10% of bankroll." }],
          correctAnswer: "0.1"
        },
        hard: {
          id: "finance-risk-hard",
          difficulty: "hard",
          title: "Continuous Kelly Leverage",
          question: [{ type: "text", text: "For dS = mu * S dt + sigma * S dW and risk-free rate r. What investment fraction f* maximizes log utility? (Format using symbols, e.g. (mu - r)/sigma^2)" }],
          hint: [{ type: "text", text: "This is the Merton share or continuous Kelly fraction." }],
          approach: [{ type: "text", text: "To maximize the growth rate of log wealth log(W_t), the continuous Kelly fraction is f* = (mu - r)/sigma^2." }],
          correctAnswer: "(mu - r)/sigma^2"
        }
      }
    ]
  }
};

export default function QuantFinanceBranchPage() {
  const params = useParams();
  const branchId = (params?.branch as string) || "logic";
  
  const branchData = useMemo(() => {
    return BRANCH_DATABASE[branchId] || BRANCH_DATABASE.logic;
  }, [branchId]);

  // Questions status tracking state
  const [progress, setProgress] = useState<Record<string, "correct" | "incorrect" | "unattempted">>({});
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  
  // Form input answer
  const [answerInput, setAnswerInput] = useState("");
  const [checkingResult, setCheckingResult] = useState<"success" | "wrong" | null>(null);

  // Accordion details
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  // Sync state with localstorage on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("convexity-quant-progress");
      if (stored) {
        try {
          setProgress(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const saveProgress = (newProgress: Record<string, "correct" | "incorrect" | "unattempted">) => {
    setProgress(newProgress);
    localStorage.setItem("convexity-quant-progress", JSON.stringify(newProgress));
  };

  const handleSelectQuestion = (q: Question) => {
    setSelectedQuestion(q);
    setAnswerInput("");
    setCheckingResult(null);
    setRevealed({});
  };

  const handleCheckAnswer = () => {
    if (!selectedQuestion) return;
    const isCorrect = answerInput.trim().toLowerCase() === selectedQuestion.correctAnswer?.toLowerCase();
    if (isCorrect) {
      setCheckingResult("success");
      const nextProgress = { ...progress, [selectedQuestion.id]: "correct" as const };
      saveProgress(nextProgress);
    } else {
      setCheckingResult("wrong");
      const nextProgress = { ...progress, [selectedQuestion.id]: "incorrect" as const };
      saveProgress(nextProgress);
    }
  };

  const handleMarkStatus = (status: "correct" | "incorrect" | "unattempted") => {
    if (!selectedQuestion) return;
    const nextProgress = { ...progress, [selectedQuestion.id]: status };
    saveProgress(nextProgress);
  };

  const getPillStyle = (qId: string, diff: string) => {
    const status = progress[qId] || "unattempted";
    const isActive = selectedQuestion?.id === qId;
    let base = "px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ";
    
    if (status === "correct") {
      base += "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 ";
    } else if (status === "incorrect") {
      base += "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 ";
    } else {
      base += "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 ";
    }

    if (isActive) {
      base += "ring-2 ring-violet-500 border-violet-500 scale-[1.03] shadow ";
    }
    return base;
  };

  return (
    <PageShell noScroll={true}>
      <div className="mx-auto max-w-5xl h-full flex flex-col justify-start py-4 space-y-6">
        {/* Navigation Breadcrumb & Header Row */}
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Link
            href="/interview-prep/quant-finance"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/70 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            title="Back to Quantitative Finance"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-hidden="true">
                {branchData.icon}
              </span>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                {branchData.title} Branch
              </p>
            </div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-white mt-0.5">
              Practice Syllabus Questions
            </h1>
          </div>
        </div>

        {/* Dynamic Split Pane Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
          
          {/* Left Pane: Topics Table (5 columns) */}
          <section className="lg:col-span-5 flex flex-col space-y-3 overflow-y-auto pr-1">
            <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Syllabus Topics & Difficulties
            </h2>
            <div className="space-y-4">
              {branchData.topics.map((topic) => {
                return (
                  <div
                    key={topic.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-850 dark:bg-slate-900/40 space-y-3 shadow-sm"
                  >
                    <div>
                      <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                        {topic.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>

                    {/* Horizontal Selector of levels on the right */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Difficulty:
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectQuestion(topic.easy)}
                          className={getPillStyle(topic.easy.id, "easy")}
                        >
                          {progress[topic.easy.id] === "correct" ? "Easy ✓" : progress[topic.easy.id] === "incorrect" ? "Easy ✗" : "Easy"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectQuestion(topic.intermediate)}
                          className={getPillStyle(topic.intermediate.id, "intermediate")}
                        >
                          {progress[topic.intermediate.id] === "correct" ? "Int ✓" : progress[topic.intermediate.id] === "incorrect" ? "Int ✗" : "Int"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectQuestion(topic.hard)}
                          className={getPillStyle(topic.hard.id, "hard")}
                        >
                          {progress[topic.hard.id] === "correct" ? "Hard ✓" : progress[topic.hard.id] === "incorrect" ? "Hard ✗" : "Hard"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right Pane: Question Viewer (7 columns) */}
          <section className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/50 dark:bg-slate-900/20 p-5 lg:p-6 shadow-sm overflow-y-auto">
            {!selectedQuestion ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 rounded-full bg-violet-500/5 dark:bg-violet-500/10 flex items-center justify-center text-3xl mb-4 border border-violet-500/10">
                  ⚡
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-250">
                  Select a topic level to start
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 leading-relaxed">
                  Choose any topic from the syllabus list on the left and select a difficulty level (Easy, Intermediate, or Hard) to view and solve the question.
                </p>
              </div>
            ) : (
              <div className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedQuestion.difficulty === "easy"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : selectedQuestion.difficulty === "intermediate"
                          ? "bg-amber-55 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                    }`}>
                      {selectedQuestion.difficulty}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500">
                      ID: {selectedQuestion.id}
                    </span>
                  </div>

                  {/* Question Title */}
                  <h2 className="font-serif text-xl font-bold text-slate-950 dark:text-white">
                    {selectedQuestion.title}
                  </h2>

                  {/* Question Body */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-850/80">
                    <InterviewContent blocks={selectedQuestion.question} />
                  </div>

                  {/* Auto Answer Check Input */}
                  {selectedQuestion.correctAnswer && (
                    <div className="space-y-2 border-t border-slate-100 dark:border-slate-850/80 pt-4">
                      <label htmlFor="ans-check" className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Check your answer:
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="ans-check"
                          type="text"
                          value={answerInput}
                          onChange={(e) => setAnswerInput(e.target.value)}
                          placeholder="Type your final answer..."
                          className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                        <button
                          type="button"
                          onClick={handleCheckAnswer}
                          className="rounded-lg bg-slate-900 dark:bg-white/10 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 dark:hover:bg-white/15"
                        >
                          Check
                        </button>
                      </div>
                      {checkingResult === "success" && (
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          ✓ Correct! Status updated to Completed.
                        </p>
                      )}
                      {checkingResult === "wrong" && (
                        <p className="text-xs font-semibold text-rose-600 dark:text-rose-450 flex items-center gap-1">
                          ✗ Incorrect. Try again or view the approach below.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Collapsibles: Hint & Approach */}
                  <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-850/80 pt-4">
                    {/* Hint Trigger */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setRevealed(prev => ({ ...prev, hint: !prev.hint }))}
                        className="w-full flex items-center justify-between rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-100"
                      >
                        <span>{revealed.hint ? "Hide Hint" : "Reveal Hint"}</span>
                        <span>{revealed.hint ? "▲" : "▼"}</span>
                      </button>
                      <CollapsibleReveal open={!!revealed.hint}>
                        <div className="mt-2 p-3 rounded-lg border border-amber-300/20 bg-amber-500/[0.03] dark:bg-amber-500/10">
                          <InterviewContent blocks={selectedQuestion.hint} />
                        </div>
                      </CollapsibleReveal>
                    </div>

                    {/* Approach Trigger */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setRevealed(prev => ({ ...prev, approach: !prev.approach }))}
                        className="w-full flex items-center justify-between rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-100"
                      >
                        <span>{revealed.approach ? "Hide Thinking Process" : "How to Approach (Solution)"}</span>
                        <span>{revealed.approach ? "▲" : "▼"}</span>
                      </button>
                      <CollapsibleReveal open={!!revealed.approach}>
                        <div className="mt-2 p-3 rounded-lg border border-violet-400/20 bg-violet-500/[0.03] dark:bg-violet-500/10">
                          <InterviewContent blocks={selectedQuestion.approach} />
                        </div>
                      </CollapsibleReveal>
                    </div>
                  </div>
                </div>

                {/* Self Assessment controls */}
                <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Mark Completion Status:
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Assess your understanding of this topic level.
                      </p>
                    </div>
                    <div className="flex gap-1.5 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleMarkStatus("correct")}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                      >
                        Correct ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMarkStatus("incorrect")}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
                      >
                        Incorrect ✗
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMarkStatus("unattempted")}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </section>

        </div>
      </div>
    </PageShell>
  );
}
