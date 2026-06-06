"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { StudyHub } from "./StudyHub";
import type { StudySubtopic, StudyTabId } from "./study-types";
import { SafeLatex } from "../components/SafeLatex";

type TrackId = "tmua" | "step";

const TRACK_TITLES: Record<TrackId, string> = {
  tmua: "TMUA",
  step: "STEP",
};

const TMUA_OPTIONS = [
  {
    id: "A",
    label:
      "\\text{If } n \\text{ is even, then } n^2 \\text{ is divisible by } 4.",
    correct: false,
  },
  {
    id: "B",
    label:
      "\\text{If } n \\text{ is odd, then } n^2 \\text{ is not divisible by } 4.",
    correct: true,
  },
  {
    id: "C",
    label:
      "n^2 \\text{ is divisible by } 4 \\iff n \\text{ is even.}",
    correct: false,
  },
  {
    id: "D",
    label:
      "\\text{If } n^2 \\text{ is not divisible by } 4 \\text{, then } n \\text{ is odd.}",
    correct: false,
  },
  {
    id: "E",
    label:
      "n \\text{ is odd } \\iff n^2 \\text{ is not divisible by } 4.",
    correct: false,
  },
] as const;

type StepTopicId = "pure" | "mechanics" | "probability" | "step3";

const STEP_TOPICS: { id: StepTopicId; label: string }[] = [
  { id: "pure", label: "Pure Mathematics" },
  { id: "mechanics", label: "Mechanics" },
  { id: "probability", label: "Probability & Statistics" },
  { id: "step3", label: "STEP 3 Advanced" },
];

const STEP_CURRICULUM: Record<StepTopicId, { subtopics: StudySubtopic[] }> = {
  pure: {
    subtopics: [
      {
        id: "advanced-integration",
        title: "Advanced Integration Techniques",
        notes: [
          {
            heading: "Core idea",
            paragraphs: [
              "STEP integration questions often reward symmetry, clever substitutions, and combining two representations of the same integral.",
              "Look for intervals such as [0, π/2] where sin x and cos x swap roles under x → π/2 − x.",
            ],
            formulaTex:
              "\\int_a^b f(x)\\,dx = \\int_a^b f(a+b-x)\\,dx",
          },
        ],
        practice: {
          paperLabel: "STEP II · Pure · Integration",
          parts: [
            "\\textbf{(i)} \\text{ Show that } \\displaystyle I = \\int_0^{\\pi/2} \\ln(\\sin x)\\,dx = -\\tfrac{\\pi}{2}\\ln 2.",
            "\\textbf{(ii)} \\text{ Hence evaluate } \\displaystyle \\int_0^{\\pi/2} \\ln(\\cos x)\\,dx.",
          ],
          solutionSteps: [
            {
              title: "Use x = π/2 − t",
              tex: "I = \\int_0^{\\pi/2} \\ln(\\cos t)\\,dt. \\text{ Adding gives } 2I = \\int_0^{\\pi/2} \\ln(\\tfrac{1}{2}\\sin 2x)\\,dx.",
            },
            {
              title: "Evaluate",
              tex: "2I = -\\tfrac{\\pi}{2}\\ln 2 + 2I \\Rightarrow I = -\\tfrac{\\pi}{2}\\ln 2.",
            },
            {
              title: "Part (ii)",
              tex: "\\int_0^{\\pi/2} \\ln(\\cos x)\\,dx = -\\tfrac{\\pi}{2}\\ln 2.",
            },
          ],
        },
      },
      {
        id: "differential-equations",
        title: "Differential Equations",
        notes: [
          {
            heading: "First-order methods",
            paragraphs: [
              "Separate when the equation factors into functions of x and y alone. For linear equations, use an integrating factor.",
              "STEP questions may disguise a substitution — check whether y' = f(ax + by) or homogeneous forms appear.",
            ],
            formulaTex:
              "y' + P(x)y = Q(x) \\Rightarrow \\mu = e^{\\int P\\,dx}",
          },
        ],
        practice: {
          paperLabel: "STEP II · Pure · Differential equations",
          parts: [
            "\\text{Find the general solution of } \\dfrac{dy}{dx} + 2y = e^{-x}, \\text{ given } y(0)=1.",
            "\\textbf{(i)} \\text{ State the integrating factor.}",
            "\\textbf{(ii)} \\text{ Hence find } y \\text{ explicitly.}",
          ],
          solutionSteps: [
            {
              title: "Integrating factor",
              tex: "\\mu = e^{\\int 2\\,dx} = e^{2x}.",
            },
            {
              title: "Multiply through",
              tex: "\\dfrac{d}{dx}(e^{2x}y) = e^{x} \\Rightarrow e^{2x}y = e^{x} + C.",
            },
            {
              title: "Initial condition",
              tex: "y(0)=1 \\Rightarrow C=0 \\Rightarrow y = e^{-x}.",
            },
          ],
        },
      },
      {
        id: "complex-numbers",
        title: "Complex Numbers & De Moivre's",
        notes: [
          {
            heading: "Polar form",
            paragraphs: [
              "Write z = re^{i╬©} to turn multiplication into adding arguments and powers into scaling the modulus.",
              "De Moivre's theorem underpins many trigonometric identities used in STEP proofs.",
            ],
            formulaTex:
              "(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)",
          },
        ],
        practice: {
          paperLabel: "STEP II · Pure · Complex numbers",
          parts: [
            "\\textbf{(i)} \\text{ Express } z = 1 + i\\sqrt{3} \\text{ in the form } re^{i\\theta}.",
            "\\textbf{(ii)} \\text{ Hence find } z^6 \\text{ in Cartesian form.}",
          ],
          solutionSteps: [
            {
              title: "Modulus and argument",
              tex: "r=2,\\; \\theta = \\tfrac{\\pi}{3} \\Rightarrow z = 2e^{i\\pi/3}.",
            },
            {
              title: "Apply De Moivre",
              tex: "z^6 = 2^6 e^{i2\\pi} = 64.",
            },
          ],
        },
      },
      {
        id: "vectors",
        title: "Vectors & Coordinate Geometry",
        notes: [
          {
            heading: "Lines and planes",
            paragraphs: [
              "Use vector equations r = a + ╬╗b for lines and scalar products to test orthogonality or find distances.",
              "For shortest distance between skew lines, project the join vector perpendicular to both direction vectors.",
            ],
            formulaTex:
              "\\mathbf{r}\\cdot\\mathbf{n} = d",
          },
        ],
        practice: {
          paperLabel: "STEP II · Pure · Vectors",
          parts: [
            "\\text{Lines } L_1: \\mathbf{r} = \\mathbf{i} + \\lambda(2\\mathbf{i}-\\mathbf{j}+\\mathbf{k}), \\; L_2: \\mathbf{r} = 3\\mathbf{j} + \\mu(\\mathbf{i}+\\mathbf{j}-\\mathbf{k}).",
            "\\textbf{(i)} \\text{ Show the lines are skew.}",
            "\\textbf{(ii)} \\text{ Find the shortest distance between them.}",
          ],
          solutionSteps: [
            {
              title: "Skew test",
              tex: "\\text{Directions not parallel; no common point by solving parameters.}",
            },
            {
              title: "Distance formula",
              tex: "d = \\dfrac{|(\\mathbf{a}_2-\\mathbf{a}_1)\\cdot(\\mathbf{b}_1\\times\\mathbf{b}_2)|}{|\\mathbf{b}_1\\times\\mathbf{b}_2|}.",
            },
          ],
        },
      },
    ],
  },
  mechanics: {
    subtopics: [
      {
        id: "projectiles-inclined",
        title: "Projectiles on Inclined Planes",
        notes: [
          {
            heading: "Resolving gravity",
            paragraphs: [
              "Tilt your axes along and perpendicular to the plane. Gravity splits into g sin ╬▓ down the slope and g cos ╬▓ into the plane.",
            ],
            formulaTex:
              "a_{\\parallel} = -g\\sin\\beta, \\quad a_{\\perp} = -g\\cos\\beta",
          },
        ],
        practice: {
          paperLabel: "STEP II · Mechanics",
          parts: [
            "\\text{Projectile speed } u \\text{ at angle } \\alpha \\text{ up a smooth plane inclined at } \\beta.",
            "\\textbf{(i)} \\text{ Show } T = \\dfrac{2u\\sin(\\alpha-\\beta)}{g\\cos\\beta}.",
            "\\textbf{(ii)} \\text{ Find the range along the plane.}",
          ],
          solutionSteps: [
            {
              title: "Perpendicular motion",
              tex: "0 = 2u\\sin(\\alpha-\\beta)T - \\tfrac{1}{2}g\\cos\\beta\\,T^2.",
            },
            {
              title: "Time of flight",
              tex: "T = \\dfrac{2u\\sin(\\alpha-\\beta)}{g\\cos\\beta}.",
            },
            {
              title: "Range",
              tex: "R = \\dfrac{u^2\\sin 2(\\alpha-\\beta)}{g\\cos\\beta}.",
            },
          ],
        },
      },
      {
        id: "collisions",
        title: "Collisions & Impulse",
        notes: [
          {
            heading: "Conservation laws",
            paragraphs: [
              "Momentum is conserved along a line of impact when external impulse is absent. Restitution links outgoing and incoming speeds.",
            ],
            formulaTex: "e = \\dfrac{\\text{speed of separation}}{\\text{speed of approach}}",
          },
        ],
        practice: {
          paperLabel: "STEP II · Mechanics · Collisions",
          parts: [
            "\\text{Particle A (mass } 2m\\text{) moving at speed } u \\text{ strikes stationary B (mass } m\\text{), } e=\\tfrac{1}{2}.",
            "\\textbf{(i)} \\text{ Find speeds after impact.}",
          ],
          solutionSteps: [
            {
              title: "Momentum",
              tex: "2mu = 2mv_A + mv_B.",
            },
            {
              title: "Restitution",
              tex: "v_B - v_A = \\tfrac{1}{2}u.",
            },
            {
              title: "Solve",
              tex: "v_A = \\tfrac{1}{2}u,\\; v_B = u.",
            },
          ],
        },
      },
      {
        id: "circular-motion",
        title: "Circular Motion",
        notes: [
          {
            heading: "Centripetal acceleration",
            paragraphs: [
              "For motion in a circle of radius r at speed v, acceleration toward the centre is v²/r.",
            ],
            formulaTex: "a = \\dfrac{v^2}{r} = r\\omega^2",
          },
        ],
        practice: {
          paperLabel: "STEP II · Mechanics · Circular motion",
          parts: [
            "\\text{A bead on a vertical circle of radius } a \\text{ at angle } \\theta \\text{ to the downward vertical.}",
            "\\textbf{(i)} \\text{ Show } T + mg\\cos\\theta = \\dfrac{mv^2}{a}.",
          ],
          solutionSteps: [
            {
              title: "Resolve radially",
              tex: "T + mg\\cos\\theta = \\dfrac{mv^2}{a} \\text{ toward centre.}",
            },
          ],
        },
      },
      {
        id: "energy-methods",
        title: "Energy & Work Methods",
        notes: [
          {
            heading: "When to use energy",
            paragraphs: [
              "Energy methods shine when forces are conservative and displacement paths are messy — avoid solving for internal reaction forces you do not need.",
            ],
            formulaTex: "\\Delta KE + \\Delta PE = \\text{work done by non-conservative forces}",
          },
        ],
        practice: {
          paperLabel: "STEP II · Mechanics · Energy",
          parts: [
            "\\text{A block slides from rest down a rough plane of length } L \\text{ with coefficient } \\mu.",
            "\\textbf{(i)} \\text{ Find speed at the bottom in terms of } L, \\mu, g, \\text{ and incline angle } \\beta.",
          ],
          solutionSteps: [
            {
              title: "Energy balance",
              tex: "mgL\\sin\\beta - \\mu mgL\\cos\\beta = \\tfrac{1}{2}mv^2.",
            },
          ],
        },
      },
    ],
  },
  probability: {
    subtopics: [
      {
        id: "continuous-rv",
        title: "Continuous Random Variables",
        notes: [
          {
            heading: "PDF rules",
            paragraphs: [
              "A density f(x) must be non-negative and integrate to 1 over the support. Probabilities are areas under the curve.",
            ],
            formulaTex:
              "\\mathbb{P}(a<X<b) = \\int_a^b f(x)\\,dx",
          },
        ],
        practice: {
          paperLabel: "STEP II · Probability",
          parts: [
            "\\text{Given } f(x)=kx(1-x) \\text{ on } (0,1). \\textbf{(i)} \\text{ Find } k. \\textbf{(ii)} \\text{ Find } \\mathbb{P}(X>0.5\\mid X>0.25).",
          ],
          solutionSteps: [
            { title: "Normalise", tex: "k=6." },
            {
              title: "Conditional",
              tex: "\\mathbb{P}(X>0.5\\mid X>0.25) = \\tfrac{5}{27}.",
            },
          ],
        },
      },
      {
        id: "conditional-probability",
        title: "Conditional Probability",
        notes: [
          {
            heading: "Definition",
            paragraphs: [
              "Conditioning restricts the sample space. Always check whether events are independent before simplifying.",
            ],
            formulaTex:
              "\\mathbb{P}(A\\mid B) = \\dfrac{\\mathbb{P}(A\\cap B)}{\\mathbb{P}(B)}",
          },
        ],
        practice: {
          paperLabel: "STEP II · Probability · Conditioning",
          parts: [
            "\\text{Bag: 3 red, 2 blue. Two draws without replacement.}",
            "\\textbf{(i)} \\text{ Find } \\mathbb{P}(\\text{both red}).",
            "\\textbf{(ii)} \\text{ Given first is red, find } \\mathbb{P}(\\text{second red}).",
          ],
          solutionSteps: [
            { title: "(i)", tex: "\\mathbb{P} = \\tfrac{3}{5}\\cdot\\tfrac{2}{4} = \\tfrac{3}{10}." },
            { title: "(ii)", tex: "\\mathbb{P} = \\tfrac{2}{4} = \\tfrac{1}{2}." },
          ],
        },
      },
      {
        id: "discrete-distributions",
        title: "Discrete Distributions",
        notes: [
          {
            heading: "Expectation",
            paragraphs: [
              "For discrete X, E(X) = Σ x P(X=x). Variance uses E(X²) − [E(X)]².",
            ],
            formulaTex: "\\mathrm{Var}(X) = \\mathbb{E}(X^2) - [\\mathbb{E}(X)]^2",
          },
        ],
        practice: {
          paperLabel: "STEP II · Statistics",
          parts: [
            "\\text{X ~ Bin(3, p). Given } \\mathbb{E}(X)=1.2, \\textbf{(i)} \\text{ find } p.",
          ],
          solutionSteps: [
            { title: "Solve", tex: "3p=1.2 \\Rightarrow p=0.4." },
          ],
        },
      },
      {
        id: "hypothesis-testing",
        title: "Hypothesis Testing Intro",
        notes: [
          {
            heading: "Framework",
            paragraphs: [
              "State HÔéÇ and HÔéü, choose a test statistic, and compare a p-value or critical value at a given significance level.",
            ],
          },
        ],
        practice: {
          paperLabel: "STEP II · Statistics · Testing",
          parts: [
            "\\text{Ten samples have mean } \\bar{x} \\text{ from } N(\\mu,4). \\text{ Test } H_0:\\mu=10 \\text{ vs } H_1:\\mu>10 \\text{ at 5\\%}.",
          ],
          solutionSteps: [
            {
              title: "z-test",
              tex: "z = \\dfrac{\\bar{x}-10}{2/\\sqrt{10}}; \\text{ compare with } z_{0.05}.",
            },
          ],
        },
      },
    ],
  },
  step3: {
    subtopics: [
      {
        id: "hyperbolic",
        title: "Hyperbolic Functions",
        notes: [
          {
            heading: "Identities",
            paragraphs: [
              "Hyperbolic functions mirror trigonometry but with sign changes in key identities. They appear in integration and differential equations at STEP III.",
            ],
            formulaTex: "\\cosh^2 x - \\sinh^2 x = 1",
          },
        ],
        practice: {
          paperLabel: "STEP III · Hyperbolic",
          parts: [
            "\\textbf{(i)} \\text{ Show } \\cosh^2 x - \\sinh^2 x = 1.",
            "\\textbf{(ii)} \\text{ Solve } \\cosh x = 5\\sinh x - 1.",
          ],
          solutionSteps: [
            { title: "Identity", tex: "\\text{From definitions of } \\cosh, \\sinh." },
            {
              title: "Solve",
              tex: "x = \\ln\\!\\left(\\tfrac{3+\\sqrt{17}}{4}\\right).",
            },
          ],
        },
      },
      {
        id: "advanced-complex",
        title: "Advanced Complex Analysis",
        notes: [
          {
            heading: "Loci in the Argand diagram",
            paragraphs: [
              "STEP III may ask you to sketch |z-a| = k|z-b| or arg(z-a) = constant — convert to Cartesian form for geometry.",
            ],
            formulaTex: "|z-z_0| = r",
          },
        ],
        practice: {
          paperLabel: "STEP III · Complex",
          parts: [
            "\\textbf{(i)} \\text{ Sketch } |z-1| = 2|z-i|.",
          ],
          solutionSteps: [
            {
              title: "Circle locus",
              tex: "\\text{Represents a circle in the Argand plane.}",
            },
          ],
        },
      },
      {
        id: "multivariable",
        title: "Multivariable Techniques",
        notes: [
          {
            heading: "Partial derivatives",
            paragraphs: [
              "Treat other variables as constants. Clairaut's theorem links mixed partials when continuity conditions hold.",
            ],
            formulaTex:
              "\\frac{\\partial^2 f}{\\partial x\\partial y} = \\frac{\\partial^2 f}{\\partial y\\partial x}",
          },
        ],
        practice: {
          paperLabel: "STEP III · Analysis",
          parts: [
            "\\text{For } f(x,y)=x^2y+e^{xy}, \\textbf{(i)} \\text{ find } f_{xy}.",
          ],
          solutionSteps: [
            { title: "Differentiate", tex: "f_x = 2xy + ye^{xy},\\; f_{xy} = 2x + e^{xy}(1+xy)." },
          ],
        },
      },
      {
        id: "induction-inequalities",
        title: "Proof by Induction & Inequalities",
        notes: [
          {
            heading: "Induction template",
            paragraphs: [
              "Base case, inductive hypothesis, inductive step. For inequalities, compare consecutive terms or use monotonicity.",
            ],
          },
        ],
        practice: {
          paperLabel: "STEP III · Proof",
          parts: [
            "\\textbf{(i)} \\text{ Prove by induction } 2^n > n^2 \\text{ for } n \\geq 5.",
          ],
          solutionSteps: [
            {
              title: "Inductive step",
              tex: "2^{k+1} = 2\\cdot 2^k > 2k^2 > (k+1)^2 \\text{ for } k\\geq 5.",
            },
          ],
        },
      },
    ],
  },
};

function getStepSubtopic(topic: StepTopicId, subtopicId: string) {
  return STEP_CURRICULUM[topic].subtopics.find((s) => s.id === subtopicId);
}

function getTrackTitle(id: TrackId) {
  return TRACK_TITLES[id] ?? "";
}

function StepMainTopicNav({
  selectedTopic,
  onSelect,
}: {
  selectedTopic: StepTopicId;
  onSelect: (id: StepTopicId) => void;
}) {
  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-slate-200 pb-4"
      aria-label="STEP main topics"
    >
      {STEP_TOPICS.map((topic) => {
        const isActive = selectedTopic === topic.id;
        return (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelect(topic.id)}
            aria-current={isActive ? "true" : undefined}
            className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              isActive
                ? "border-violet-200 bg-violet-50 text-violet-750 shadow-sm font-semibold dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400"
                : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-350 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-300"
            }`}
          >
            {topic.label}
          </button>
        );
      })}
    </nav>
  );
}

function StepSubtopicList({
  topic,
  selectedSubtopicId,
  onSelect,
}: {
  topic: StepTopicId;
  selectedSubtopicId: string;
  onSelect: (id: string) => void;
}) {
  const subtopics = STEP_CURRICULUM[topic].subtopics;

  return (
    <nav
      className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1"
      aria-label="Subtopics"
    >
      {subtopics.map((sub) => {
        const isActive = selectedSubtopicId === sub.id;
        return (
          <button
            key={sub.id}
            type="button"
            onClick={() => onSelect(sub.id)}
            aria-current={isActive ? "true" : undefined}
            className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
              isActive
                ? "border-violet-200 bg-violet-50 text-violet-750 font-semibold shadow-sm dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400"
                : "border-slate-200 bg-slate-50/50 text-slate-750 hover:border-slate-350 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-300"
            }`}
          >
            {sub.title}
          </button>
        );
      })}
    </nav>
  );
}

function StepPracticeSection() {
  const [selectedStepTopic, setSelectedStepTopic] =
    useState<StepTopicId>("pure");
  const [selectedSubtopicId, setSelectedSubtopicId] = useState("");
  const [activeStudyTab, setActiveStudyTab] = useState<StudyTabId>("notes");

  const subtopics = STEP_CURRICULUM[selectedStepTopic].subtopics;
  const activeSubtopicId = selectedSubtopicId && subtopics.some((s) => s.id === selectedSubtopicId)
    ? selectedSubtopicId
    : (subtopics[0]?.id || "");

  const subtopic = getStepSubtopic(selectedStepTopic, activeSubtopicId);

  const [prevStepTopic, setPrevStepTopic] = useState(selectedStepTopic);
  if (selectedStepTopic !== prevStepTopic) {
    setPrevStepTopic(selectedStepTopic);
    setSelectedSubtopicId("");
    setActiveStudyTab("notes");
  }

  const [prevActiveSubtopicId, setPrevActiveSubtopicId] = useState(activeSubtopicId);
  if (activeSubtopicId !== prevActiveSubtopicId) {
    setPrevActiveSubtopicId(activeSubtopicId);
    setActiveStudyTab("notes");
  }

  return (
    <div className="space-y-6">
      <StepMainTopicNav
        selectedTopic={selectedStepTopic}
        onSelect={setSelectedStepTopic}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="lg:w-72 lg:shrink-0">
          <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-widest text-slate-900">
            Subtopics
          </p>
          <StepSubtopicList
            topic={selectedStepTopic}
            selectedSubtopicId={activeSubtopicId}
            onSelect={setSelectedSubtopicId}
          />
        </aside>

        {subtopic ? (
          <StudyHub
            key={activeSubtopicId}
            subtopic={subtopic}
            activeStudyTab={activeStudyTab}
            onTabChange={setActiveStudyTab}
            videoCaption="Watch standard STEP walkthrough for this module"
            solutionIdPrefix="step"
          />
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/50 p-12 text-slate-600">
            Select a subtopic to open the study hub.
          </div>
        )}
      </div>
    </div>
  );
}

function PracticeQuestionCard({ track }: { track: TrackId }) {
  const [tmuaSelection, setTmuaSelection] = useState<string | null>(null);
  const [tmuaChecked, setTmuaChecked] = useState(false);

  const [prevTrack, setPrevTrack] = useState(track);
  if (track !== prevTrack) {
    setPrevTrack(track);
    setTmuaSelection(null);
    setTmuaChecked(false);
  }

  return (
    <section
      className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-md"
      aria-labelledby="practice-question-title"
    >
      <h2
        id="practice-question-title"
        className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600"
      >
        Practice question
      </h2>

      {track === "tmua" && (
        <div className="mt-6 space-y-6 text-slate-800">
          <p className="text-sm font-semibold text-slate-900">
            TMUA Paper 2 · Logical reasoning
          </p>
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            Let <em>n</em> be an integer. Consider the statement:{" "}
            <strong className="font-bold text-slate-900">
              &ldquo;If n² is divisible by 4, then n is even.&rdquo;
            </strong>{" "}
            Which option is{" "}
            <strong className="font-bold text-slate-900">
              logically equivalent
            </strong>{" "}
            to this statement?
          </p>

          <div
            className="space-y-3"
            role="radiogroup"
            aria-label="Answer options"
          >
            {TMUA_OPTIONS.map((opt) => {
              const isSelected = tmuaSelection === opt.id;
              const isWrongPick = tmuaChecked && isSelected && !opt.correct;
              const isCorrectOption = tmuaChecked && opt.correct;

              let optionClass =
                "w-full rounded-xl border px-4 py-3 text-left text-sm transition sm:text-base ";

              if (!tmuaChecked) {
                optionClass += isSelected
                  ? "border-violet-500/30 bg-violet-500/5 text-violet-750 font-semibold"
                  : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-350 hover:bg-slate-100";
              } else if (isCorrectOption) {
                optionClass +=
                  "border-emerald-400 bg-emerald-500/10 text-emerald-800 ring-1 ring-emerald-400/30 font-semibold";
              } else if (isWrongPick) {
                optionClass +=
                  "border-red-400 bg-red-500/10 text-red-800 ring-1 ring-red-400/30 font-semibold";
              } else {
                optionClass += "border-slate-100 bg-slate-50/20 text-slate-400";
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={tmuaChecked}
                  onClick={() => setTmuaSelection(opt.id)}
                  className={optionClass}
                >
                  <span className="font-bold text-slate-900">{opt.id}.</span>{" "}
                  <span className="latex-panel min-w-0 flex-1">
                    <SafeLatex
                      tex={opt.label}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              disabled={!tmuaSelection || tmuaChecked}
              onClick={() => setTmuaChecked(true)}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check answer
            </button>
            {tmuaChecked && (
              <p
                className={`text-sm font-semibold ${
                  TMUA_OPTIONS.find((o) => o.id === tmuaSelection)?.correct
                    ? "text-emerald-700"
                    : "text-red-650"
                }`}
              >
                {TMUA_OPTIONS.find((o) => o.id === tmuaSelection)?.correct
                  ? "Correct — this is the contrapositive."
                  : "Not quite — try the contrapositive form."}
              </p>
            )}
          </div>
        </div>
      )}

    </section>
  );
}

function PracticeRoom({ track }: { track: TrackId }) {
  return (
    <div className="space-y-6">
      <header className="max-w-3xl border-b border-slate-200 pb-4 dark:border-slate-800">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan-600">
          {getTrackTitle(track)}
        </p>
        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
          {track === "step"
            ? "Pick a main topic, choose a subtopic, then study with revision notes, video walkthroughs, and practice problems."
            : "Work through admissions-style practice questions and logical reasoning drills."}
        </p>
      </header>

      <div className={track === "step" ? undefined : "max-w-3xl"}>
        {track === "step" ? (
          <StepPracticeSection />
        ) : (
          <PracticeQuestionCard track={track} />
        )}
      </div>
    </div>
  );
}

const ADMISSIONS_TESTS = [
  { id: "tmua" as const, label: "TMUA", href: "/exam-prep/admissions?track=tmua" },
  { id: "step" as const, label: "STEP", href: "/exam-prep/admissions?track=step" },
];

export default function ExamPrepClient({
  urlPrefix = "/exam-prep/admissions",
}: {
  urlPrefix?: string;
}) {
  const searchParams = useSearchParams();
  const trackParam = searchParams.get("track");
  const activeTrack: TrackId | null =
    trackParam === "tmua" || trackParam === "step" ? trackParam : null;

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 space-y-6 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 lg:w-64">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-400">
            Test
          </p>
          <nav className="flex flex-col gap-1.5" aria-label="Admissions test">
            {[
              { id: "tmua" as const, label: "TMUA" },
              { id: "step" as const, label: "STEP" },
            ].map((test) => {
              const active = activeTrack === test.id;
              const linkHref = urlPrefix.includes("?")
                ? `${urlPrefix}&track=${test.id}`
                : `${urlPrefix}?track=${test.id}`;
              return (
                <Link
                  key={test.id}
                  href={linkHref}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "border-violet-500/30 bg-violet-500/5 text-violet-700 dark:text-violet-300 font-semibold"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
                  }`}
                >
                  {test.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {activeTrack === null ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select <strong className="text-slate-800 dark:text-slate-200">TMUA</strong> or{" "}
            <strong className="text-slate-800 dark:text-slate-200">STEP</strong> on the left to open a practice room.
          </p>
        ) : (
          <PracticeRoom track={activeTrack} />
        )}
      </div>
    </div>
  );
}
