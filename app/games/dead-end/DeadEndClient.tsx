"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { PageShell } from "../../components/PageShell";
import { useAuth } from "../../components/AuthContext";
import { loadProfile, saveProfile, type UserProfile, DEFAULT_PROFILE } from "@/lib/user-settings";

// ----------------------------------------------------
// Type Definitions
// ----------------------------------------------------
type BranchType = "projection" | "breakpoint" | "arena";
type PlayMode = "single" | "multiplayer";
type GamePhase = "menu" | "matchmaking" | "countdown" | "playing" | "gameover";

type Obstacle =
  | { type: "rect"; x1: number; y1: number; x2: number; y2: number }
  | { type: "circle"; cx: number; cy: number; r: number };

type Point = { x: number; y: number };

type GraphSegment = {
  equation: string;
  points: Point[];
  bounced: boolean;
};

type SimulatedPlayer = {
  id: string;
  name: string;
  country: string;
  elo: number;
  color: string;
  currentX: number;
  timeFinished: number | null; // For Breakpoint
  maxProjection: number;       // For Projection
  ghostPath: Point[];          // Simulated trajectory
};

// ----------------------------------------------------
// Date Utility & Daily Map Generator
// ----------------------------------------------------
function getTodayDateKey(): string {
  if (typeof window === "undefined") return "2026-06-20";
  return new Date().toISOString().slice(0, 10);
}

type GameMap = {
  id: string;
  name: string;
  description: string;
  obstacles: Obstacle[];
};

function getDailyMap(dateKey: string, branch: string): GameMap {
  // Hash dateKey to create a deterministic daily seed
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) | 0;
  }
  let seed = Math.abs(hash) + (branch === "projection" ? 500 : 800);
  
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const obstacles: Obstacle[] = [];
  // Generate 2 or 3 obstacles deterministically based on date
  const count = 2 + Math.floor(random() * 2);
  
  for (let i = 0; i < count; i++) {
    const x = 3.0 + i * 2.8 + random() * 1.0;
    if (random() > 0.55) {
      obstacles.push({
        type: "circle",
        cx: x,
        cy: -2.5 + random() * 5.0,
        r: 0.9 + random() * 0.7,
      });
    } else {
      const height = 2.2 + random() * 2.3;
      const top = random() > 0.5;
      if (top) {
        obstacles.push({ type: "rect", x1: x, y1: 6.0 - height, x2: x + 1.1, y2: 6.0 });
      } else {
        obstacles.push({ type: "rect", x1: x, y1: -6.0, x2: x + 1.1, y2: -6.0 + height });
      }
    }
  }

  const mapNames = ["Vortex", "Chamber", "Ridge", "Pinnacle", "Canopy", "Abyss"];
  const mapName = mapNames[Math.abs(hash) % mapNames.length] + " Course " + dateKey.slice(-2);

  return {
    id: `daily-${branch}-${dateKey}`,
    name: `Daily ${branch === "projection" ? "Projection" : "Breakpoint"}: ${mapName}`,
    description: `Today's dynamically generated map for fair play.`,
    obstacles,
  };
}

// ----------------------------------------------------
// Arena Map Generator (50 Levels)
// ----------------------------------------------------
function getArenaMap(level: number): GameMap {
  const obstacles: Obstacle[] = [];
  
  // Set up deterministic random numbers based on level
  let seed = level * 77777;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  if (level <= 10) {
    // Easy: 1 rectangular barrier leaving wide gaps
    const count = level <= 5 ? 1 : 2;
    for (let i = 0; i < count; i++) {
      const x = 3.5 + i * 3.5 + random() * 1.0;
      const height = 1.8 + random() * 1.5;
      const top = random() > 0.5;
      if (top) {
        obstacles.push({ type: "rect", x1: x, y1: 6.0 - height, x2: x + 1.0, y2: 6.0 });
      } else {
        obstacles.push({ type: "rect", x1: x, y1: -6.0, x2: x + 1.0, y2: -6.0 + height });
      }
    }
  } else if (level <= 25) {
    // Medium: 2-3 barriers, slightly narrower gaps, some circular posts
    const count = 2 + (level % 2);
    for (let i = 0; i < count; i++) {
      const x = 2.8 + i * 2.8 + random() * 0.8;
      if (i === 1 && level % 3 === 0) {
        obstacles.push({ type: "circle", cx: x, cy: -2.0 + random() * 4.0, r: 0.8 + random() * 0.5 });
      } else {
        const height = 2.4 + random() * 1.6;
        const top = i % 2 === 0;
        if (top) {
          obstacles.push({ type: "rect", x1: x, y1: 6.0 - height, x2: x + 1.0, y2: 6.0 });
        } else {
          obstacles.push({ type: "rect", x1: x, y1: -6.0, x2: x + 1.0, y2: -6.0 + height });
        }
      }
    }
  } else if (level <= 40) {
    // Hard: 3-4 obstacles, wiggles and central circular traps
    const count = 3 + (level % 2);
    for (let i = 0; i < count; i++) {
      const x = 2.2 + i * 2.4 + random() * 0.6;
      if (random() > 0.5) {
        obstacles.push({ type: "circle", cx: x, cy: -2.5 + random() * 5.0, r: 1.0 + random() * 0.6 });
      } else {
        const height = 3.2 + random() * 1.3;
        const top = random() > 0.5;
        if (top) {
          obstacles.push({ type: "rect", x1: x, y1: 6.0 - height, x2: x + 0.9, y2: 6.0 });
        } else {
          obstacles.push({ type: "rect", x1: x, y1: -6.0, x2: x + 0.9, y2: -6.0 + height });
        }
      }
    }
  } else {
    // Insane levels: 4-5 obstacles, tiny gaps
    const count = 4 + (level % 2);
    for (let i = 0; i < count; i++) {
      const x = 2.0 + i * 2.0 + random() * 0.4;
      if (i % 2 === 0) {
        obstacles.push({ type: "circle", cx: x, cy: -3.0 + random() * 6.0, r: 1.1 + random() * 0.5 });
      } else {
        const height = 4.0 + random() * 1.0;
        const top = random() > 0.5;
        if (top) {
          obstacles.push({ type: "rect", x1: x, y1: 6.0 - height, x2: x + 0.8, y2: 6.0 });
        } else {
          obstacles.push({ type: "rect", x1: x, y1: -6.0, x2: x + 0.8, y2: -6.0 + height });
        }
      }
    }
  }

  return {
    id: `arena-${level}`,
    name: `Arena Level ${level}`,
    description: `Level ${level} of 50. procedural difficulty campaign.`,
    obstacles,
  };
}

// ----------------------------------------------------
// Graph Equation Parser
// ----------------------------------------------------
function parseEquation(input: string): (dx: number) => number {
  let cleaned = input.trim().toLowerCase();
  cleaned = cleaned.replace(/^(y|f\(dx\))\s*=\s*/, "");
  
  if (!cleaned) {
    throw new Error("Equation is empty.");
  }
  
  // Exponent translation: handle negative exponents like x^-2 or x^-1.5
  cleaned = cleaned.replace(/x\s*\^\s*-\s*(\d+(\.\d+)?)/g, "x**(-$1)");
  cleaned = cleaned.replace(/x\s*\^\s*(\d+(\.\d+)?)/g, "x**$1");
  cleaned = cleaned.replace(/\^/g, "**");

  // Validate allowed characters/tokens
  const validationStr = cleaned
    .replace(/sin|cos|tan|sqrt|log|ln|exp|abs|pi|e/g, "")
    .replace(/[0-9x+\-*/().\s^%]/g, "");
  
  if (validationStr.length > 0) {
    throw new Error(`Invalid character or token: "${validationStr[0]}"`);
  }
  
  let jsExpr = cleaned;
  jsExpr = jsExpr.replace(/\b(sin|cos|tan|sqrt|log|exp|abs)\b/g, "Math.$1");
  jsExpr = jsExpr.replace(/\bln\b/g, "Math.log");
  jsExpr = jsExpr.replace(/\bpi\b/g, "Math.PI");
  jsExpr = jsExpr.replace(/\be\b/g, "Math.E");
  
  // Implicit multiplication: "2x" -> "2*x", "(x)(x)" -> "(x)*(x)"
  jsExpr = jsExpr.replace(/(\d)(x)/g, "$1*$2");
  jsExpr = jsExpr.replace(/(\d|\))(\()/g, "$1*$2");
  jsExpr = jsExpr.replace(/(x)(\()/g, "$1*$2");
  jsExpr = jsExpr.replace(/(x)(\d)/g, "$1*$2");
  
  try {
    const fn = new Function("x", `return ${jsExpr};`);
    fn(1); // Test execution
    return fn as (x: number) => number;
  } catch (err) {
    throw new Error("Syntax error. Try using '*' explicitly e.g. 2*x.");
  }
}

// ----------------------------------------------------
// Bounce Collision Math Utilities
// ----------------------------------------------------
function getLineIntersection(p0: Point, p1: Point, p2: Point, p3: Point): { pt: Point; t: number; normal: Point } | null {
  const s1_x = p1.x - p0.x;
  const s1_y = p1.y - p0.y;
  const s2_x = p3.x - p2.x;
  const s2_y = p3.y - p2.y;

  const denom = -s2_x * s1_y + s1_x * s2_y;
  if (Math.abs(denom) < 1e-8) return null; // Parallel

  const s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / denom;
  const t = ( s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / denom;

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    // Normal vector of the segment p2 -> p3 pointing outwards
    const dx = p3.x - p2.x;
    const dy = p3.y - p2.y;
    // Normal perpendicular
    let nx = -dy;
    let ny = dx;
    const len = Math.sqrt(nx * nx + ny * ny);
    nx = nx / len;
    ny = ny / len;

    return {
      pt: { x: p0.x + t * s1_x, y: p0.y + t * s1_y },
      t,
      normal: { x: nx, y: ny },
    };
  }
  return null;
}

function getCircleIntersection(p0: Point, p1: Point, cx: number, cy: number, r: number): { pt: Point; t: number; normal: Point } | null {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const fx = p0.x - cx;
  const fy = p0.y - cy;

  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - r * r;

  const discriminant = b * b - 4 * a * c;
  if (discriminant >= 0) {
    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

    let t = -1;
    if (t1 >= 0 && t1 <= 1) t = t1;
    else if (t2 >= 0 && t2 <= 1) t = t2;

    if (t >= 0 && t <= 1) {
      const colX = p0.x + t * dx;
      const colY = p0.y + t * dy;
      // Normal points from center to collision point
      let nx = colX - cx;
      let ny = colY - cy;
      const len = Math.sqrt(nx * nx + ny * ny);
      nx = nx / len;
      ny = ny / len;

      return {
        pt: { x: colX, y: colY },
        t,
        normal: { x: nx, y: ny },
      };
    }
  }
  return null;
}

// Check boundary wall bounces (boundaries are X in [0, 12] and Y in [-6, 6])
function checkBoundaryCollision(p0: Point, p1: Point): { pt: Point; normal: Point; t: number } | null {
  // Top boundary (y = 6.0)
  if (p1.y > 6.0 && p0.y <= 6.0) {
    const t = (6.0 - p0.y) / (p1.y - p0.y);
    return {
      pt: { x: p0.x + t * (p1.x - p0.x), y: 6.0 },
      normal: { x: 0, y: -1 },
      t,
    };
  }
  // Bottom boundary (y = -6.0)
  if (p1.y < -6.0 && p0.y >= -6.0) {
    const t = (-6.0 - p0.y) / (p1.y - p0.y);
    return {
      pt: { x: p0.x + t * (p1.x - p0.x), y: -6.0 },
      normal: { x: 0, y: 1 },
      t,
    };
  }
  // Left boundary (x = 0.0)
  if (p1.x < 0.0 && p0.x >= 0.0) {
    const t = (0.0 - p0.x) / (p1.x - p0.x);
    return {
      pt: { x: 0.0, y: p0.y + t * (p1.y - p0.y) },
      normal: { x: 1, y: 0 },
      t,
    };
  }
  // We do not bounce off the right finish line (x >= 12.0)
  return null;
}

// Calculate the full particle path, incorporating elastic bounces
function calculateBouncingTrajectory(
  startPos: Point,
  fn: (dx: number) => number,
  power: number,
  obstacles: Obstacle[]
): { points: Point[]; bounced: boolean } {
  const points: Point[] = [startPos];
  let current = { ...startPos };
  let bounced = false;

  const yOffset = fn(0); // Offset so the graph evaluates relative to startPos.y at dx=0

  const step = 0.035;
  const totalSteps = Math.ceil(power / step);

  let stepIndex = 0;
  let inFreeFly = false;
  // Free fly velocity vector
  let vx = 1.0;
  let vy = 0.0;

  while (stepIndex < totalSteps && current.x < 12.0) {
    stepIndex++;
    let next: Point;

    if (!inFreeFly) {
      // Follow the graph relative displacement
      const dx = stepIndex * step;
      next = {
        x: startPos.x + dx,
        y: startPos.y + (fn(dx) - yOffset),
      };
    } else {
      // Free fly along velocity vector
      next = {
        x: current.x + vx * step,
        y: current.y + vy * step,
      };
    }

    // Check boundary or obstacle collision
    let closestCollision: { pt: Point; normal: Point } | null = null;
    let minT = 2.0;

    // Boundary check
    const boundCol = checkBoundaryCollision(current, next);
    if (boundCol && boundCol.t < minT) {
      minT = boundCol.t;
      closestCollision = boundCol;
    }

    // Obstacles check
    for (const obs of obstacles) {
      if (obs.type === "rect") {
        // Build 4 side segments
        const xMin = Math.min(obs.x1, obs.x2);
        const xMax = Math.max(obs.x1, obs.x2);
        const yMin = Math.min(obs.y1, obs.y2);
        const yMax = Math.max(obs.y1, obs.y2);

        const sides = [
          { p1: { x: xMin, y: yMin }, p2: { x: xMax, y: yMin }, n: { x: 0, y: -1 } }, // bottom
          { p1: { x: xMin, y: yMax }, p2: { x: xMax, y: yMax }, n: { x: 0, y: 1 } },  // top
          { p1: { x: xMin, y: yMin }, p2: { x: xMin, y: yMax }, n: { x: -1, y: 0 } }, // left
          { p1: { x: xMax, y: yMin }, p2: { x: xMax, y: yMax }, n: { x: 1, y: 0 } },  // right
        ];

        for (const side of sides) {
          const col = getLineIntersection(current, next, side.p1, side.p2);
          if (col && col.t < minT) {
            minT = col.t;
            closestCollision = { pt: col.pt, normal: side.n };
          }
        }
      } else if (obs.type === "circle") {
        const col = getCircleIntersection(current, next, obs.cx, obs.cy, obs.r);
        if (col && col.t < minT) {
          minT = col.t;
          closestCollision = { pt: col.pt, normal: col.normal };
        }
      }
    }

    if (closestCollision) {
      // Bounce!
      bounced = true;
      
      // If we weren't in free fly, calculate the initial velocity tangent vector at collision
      if (!inFreeFly) {
        const prevPt = points[points.length - 1] || current;
        const dx = next.x - prevPt.x;
        const dy = next.y - prevPt.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        vx = dx / (len || 1);
        vy = dy / (len || 1);
        inFreeFly = true;
      }

      // Reflect velocity vector: v_new = v - 2 * (v.n) * n
      const dot = vx * closestCollision.normal.x + vy * closestCollision.normal.y;
      vx = vx - 2 * dot * closestCollision.normal.x;
      vy = vy - 2 * dot * closestCollision.normal.y;

      // Small bounce displacement along the normal to prevent sticking
      current = {
        x: closestCollision.pt.x + closestCollision.normal.x * 0.005,
        y: closestCollision.pt.y + closestCollision.normal.y * 0.005,
      };
      points.push(current);
    } else {
      current = next;
      points.push(current);
    }
  }

  return { points, bounced };
}

export function DeadEndClient() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Active game setups
  const [branch, setBranch] = useState<BranchType>("projection");
  const [mode, setMode] = useState<PlayMode>("single");
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [selectedMapId, setSelectedMapId] = useState("zigzag");

  // Arena states
  const [arenaLevel, setArenaLevel] = useState(1);

  // High score tracking
  const [bestTimes, setBestTimes] = useState<Record<string, number>>({});
  const [bestProjections, setBestProjections] = useState<Record<string, number>>({});

  // Matchmaking states
  const [matchmakingTime, setMatchmakingTime] = useState(0);
  const [lobbyPlayers, setLobbyPlayers] = useState<SimulatedPlayer[]>([]);
  const [countdownTime, setCountdownTime] = useState(3);

  // Play settings and inputs
  const [equationText, setEquationText] = useState("");
  const [power, setPower] = useState(6.0); // Selected launch range (1.0 to 15.0)
  const [parserError, setParserError] = useState<string | null>(null);

  // Trajectory tracking
  const [currentPos, setCurrentPos] = useState<Point>({ x: 0, y: 0 });
  const [segments, setSegments] = useState<GraphSegment[]>([]);
  const [animationPoints, setAnimationPoints] = useState<Point[]>([]);
  const [activeAnimationIndex, setActiveAnimationIndex] = useState(-1);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchTimer, setLaunchTimer] = useState<number | null>(null);

  // Play metrics
  const [elapsedMs, setElapsedMs] = useState(0);
  const [projectionMovesLeft, setProjectionMovesLeft] = useState(3);

  // Chat message logs
  const [chatMessages, setChatMessages] = useState<{ author: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const todayKey = getTodayDateKey();

  // Active map computation
  const activeMap = useMemo((): GameMap => {
    if (branch === "arena") {
      return getArenaMap(arenaLevel);
    }
    return getDailyMap(todayKey, branch);
  }, [branch, arenaLevel, todayKey]);

  // ----------------------------------------------------
  // Load local storage states
  // ----------------------------------------------------
  useEffect(() => {
    setProfile(loadProfile());

    const savedTimesStr = localStorage.getItem("convexity-deadend-best-times");
    if (savedTimesStr) {
      try { setBestTimes(JSON.parse(savedTimesStr)); } catch (e) { console.error(e); }
    }
    const savedProjStr = localStorage.getItem("convexity-deadend-best-projections");
    if (savedProjStr) {
      try { setBestProjections(JSON.parse(savedProjStr)); } catch (e) { console.error(e); }
    }

    const savedArenaLevel = localStorage.getItem("convexity-deadend-arena-level");
    if (savedArenaLevel) {
      setArenaLevel(parseInt(savedArenaLevel, 10));
    }
  }, []);

  // ----------------------------------------------------
  // Simulated Matchmaking
  // ----------------------------------------------------
  useEffect(() => {
    if (phase !== "matchmaking") return;
    setMatchmakingTime(0);
    setLobbyPlayers([]);

    const interval = setInterval(() => {
      setMatchmakingTime((t) => t + 1);
    }, 1000);

    const opponentPool = [
      { name: "CalculusLord", country: "Germany", elo: 1250, color: "#ec4899" },
      { name: "EulerFan", country: "Spain", elo: 1210, color: "#3b82f6" },
      { name: "MatrixRef", country: "Canada", elo: 1180, color: "#f59e0b" },
      { name: "PrimeHunter", country: "United Kingdom", elo: 1390, color: "#10b981" },
      { name: "Sofia", country: "France", elo: 1140, color: "#8b5cf6" },
    ];

    const shuffled = [...opponentPool].sort(() => Math.random() - 0.5);
    const count = 3 + Math.floor(Math.random() * 3); // 3-5 opponents
    const joined: SimulatedPlayer[] = [];
    const timeouts: NodeJS.Timeout[] = [];

    for (let i = 0; i < count; i++) {
      const delay = 1000 + i * (1200 + Math.random() * 1000);
      const to = setTimeout(() => {
        const opp = shuffled[i % shuffled.length];

        // Opponent ghost path generator (pre-simulated wiggles)
        const ghostPath: Point[] = [];
        let cx = 0;
        let cy = 0;
        ghostPath.push({ x: cx, y: cy });

        // Navigate daily map deterministically
        while (cx < 12) {
          cx += 0.16;
          // Simple wiggle path to reach finish
          cy = Math.sin(cx * 1.2) * 2.0;
          
          // Collision avoidance adjustments
          activeMap.obstacles.forEach((obs) => {
            if (obs.type === "rect") {
              const xMin = Math.min(obs.x1, obs.x2);
              const xMax = Math.max(obs.x1, obs.x2);
              if (cx >= xMin - 0.2 && cx <= xMax + 0.2) {
                // Steer away
                cy = obs.y1 > 0 ? obs.y1 - 1.2 : obs.y2 + 1.2;
              }
            } else if (obs.type === "circle") {
              const dist = Math.sqrt((cx - obs.cx) ** 2 + (cy - obs.cy) ** 2);
              if (dist <= obs.r + 0.2) {
                cy = obs.cy > 0 ? obs.cy - (obs.r + 0.5) : obs.cy + (obs.r + 0.5);
              }
            }
          });

          ghostPath.push({ x: cx, y: cy });
        }

        const newOpp: SimulatedPlayer = {
          id: `sim-opp-${Date.now()}-${i}`,
          name: opp.name,
          country: opp.country,
          elo: opp.elo,
          color: opp.color,
          currentX: 0,
          timeFinished: null,
          maxProjection: 0,
          ghostPath,
        };

        joined.push(newOpp);
        setLobbyPlayers([...joined]);

        if (Math.random() > 0.4) {
          const greets = ["hi!", "GL HF", "hope i don't bounce off forever!", "let's go!", "hey!"];
          setChatMessages((prev) => [
            ...prev,
            { author: opp.name, text: greets[Math.floor(Math.random() * greets.length)] },
          ]);
        }
      }, delay);
      timeouts.push(to);
    }

    const complete = setTimeout(() => {
      setPhase("countdown");
    }, 8500);

    return () => {
      clearInterval(interval);
      clearTimeout(complete);
      timeouts.forEach((to) => clearTimeout(to));
    };
  }, [phase, activeMap]);

  // ----------------------------------------------------
  // Lobby Countdown
  // ----------------------------------------------------
  useEffect(() => {
    if (phase !== "countdown") return;
    setCountdownTime(3);

    const interval = setInterval(() => {
      setCountdownTime((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setPhase("playing");
          startGameplay();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // ----------------------------------------------------
  // Opponents simulation during play
  // ----------------------------------------------------
  useEffect(() => {
    if (phase !== "playing" || mode !== "multiplayer") return;

    const interval = setInterval(() => {
      setLobbyPlayers((players) =>
        players.map((p) => {
          if (branch === "breakpoint") {
            if (p.timeFinished !== null) return p;
            const step = 0.09 + (p.elo - 1100) * 0.0001;
            const nextX = Math.min(12, p.currentX + step + (Math.random() * 0.04 - 0.02));
            const finished = nextX >= 10.0;
            return {
              ...p,
              currentX: nextX,
              timeFinished: finished ? elapsedMs : null,
            };
          } else {
            // Projection
            if (p.maxProjection >= 10.0) return p;
            if (Math.random() < 0.05) {
              const add = 2.0 + Math.random() * 1.6;
              const nextX = Math.min(11.5, p.maxProjection + add);
              return {
                ...p,
                maxProjection: nextX,
                currentX: nextX,
              };
            }
            return p;
          }
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, [phase, mode, branch, elapsedMs]);

  // ----------------------------------------------------
  // Main Play Elapsed Timer
  // ----------------------------------------------------
  useEffect(() => {
    if (phase !== "playing") return;

    const start = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - start);
    }, 45);

    return () => clearInterval(interval);
  }, [phase]);

  // ----------------------------------------------------
  // Reset Play Area
  // ----------------------------------------------------
  const startGameplay = () => {
    setCurrentPos({ x: 0, y: 0 });
    setSegments([]);
    setEquationText("");
    setParserError(null);
    setElapsedMs(0);
    setProjectionMovesLeft(3);
    setIsLaunching(false);
    if (launchTimer) clearInterval(launchTimer);
  };

  // ----------------------------------------------------
  // Canvas Render Frame
  // ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1200;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    const toCanvasX = (cx: number) => (cx / 12) * width;
    const toCanvasY = (cy: number) => ((6 - cy) / 12) * height;

    // Clean background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    // 1. Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 12; x++) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(x), 0);
      ctx.lineTo(toCanvasX(x), height);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.font = "14px monospace";
      ctx.fillText(x.toString(), toCanvasX(x) - 5, height - 10);
    }
    for (let y = -6; y <= 6; y++) {
      ctx.beginPath();
      ctx.moveTo(0, toCanvasY(y));
      ctx.lineTo(width, toCanvasY(y));
      ctx.stroke();

      if (y !== 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.font = "14px monospace";
        ctx.fillText(y.toString(), 10, toCanvasY(y) + 5);
      }
    }

    // Axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, toCanvasY(0));
    ctx.lineTo(width, toCanvasY(0));
    ctx.stroke();

    // 2. Start/Finish Zones
    ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
    ctx.fillRect(0, 0, toCanvasX(0.5), height);
    ctx.strokeStyle = "rgba(59, 130, 246, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0.5), 0);
    ctx.lineTo(toCanvasX(0.5), height);
    ctx.stroke();

    ctx.fillStyle = "rgba(16, 185, 129, 0.08)";
    ctx.fillRect(toCanvasX(10), 0, width - toCanvasX(10), height);
    
    // Checkered line at x=10
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.moveTo(toCanvasX(10), 0);
    ctx.lineTo(toCanvasX(10), height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("START", 12, 30);

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("FINISH (x = 10)", toCanvasX(10) + 15, 30);

    // 3. Draw Obstacles
    activeMap.obstacles.forEach((obs) => {
      if (obs.type === "rect") {
        const xMin = Math.min(obs.x1, obs.x2);
        const yMin = Math.min(obs.y1, obs.y2);
        const w = Math.abs(obs.x2 - obs.x1);
        const h = Math.abs(obs.y2 - obs.y1);

        const cxX = toCanvasX(xMin);
        const cxY = toCanvasY(yMin + h);
        const cxW = toCanvasX(xMin + w) - cxX;
        const cxH = toCanvasY(yMin) - cxY;

        const grad = ctx.createLinearGradient(cxX, cxY, cxX + cxW, cxY + cxH);
        grad.addColorStop(0, "rgba(244, 63, 94, 0.22)"); // Rose/pink glow
        grad.addColorStop(1, "rgba(244, 63, 94, 0.04)");

        ctx.fillStyle = grad;
        ctx.fillRect(cxX, cxY, cxW, cxH);

        ctx.strokeStyle = "rgba(244, 63, 94, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(cxX, cxY, cxW, cxH);
      } else if (obs.type === "circle") {
        const cxX = toCanvasX(obs.cx);
        const cxY = toCanvasY(obs.cy);
        const cxR = (obs.r / 12) * width;

        const grad = ctx.createRadialGradient(cxX, cxY, 2, cxX, cxY, cxR);
        grad.addColorStop(0, "rgba(244, 63, 94, 0.25)");
        grad.addColorStop(1, "rgba(244, 63, 94, 0.04)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cxX, cxY, cxR, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(244, 63, 94, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cxX, cxY, cxR, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // 4. Opponent trails (ghost lines)
    if (mode === "multiplayer") {
      lobbyPlayers.forEach((opp) => {
        ctx.strokeStyle = opp.color + "25";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        opp.ghostPath.forEach((pt, i) => {
          if (pt.x > opp.currentX) return;
          if (i === 0) ctx.moveTo(toCanvasX(pt.x), toCanvasY(pt.y));
          else ctx.lineTo(toCanvasX(pt.x), toCanvasY(pt.y));
        });
        ctx.stroke();

        // Marker
        if (opp.currentX < 12.0) {
          const idx = Math.min(opp.ghostPath.length - 1, Math.max(0, Math.floor((opp.currentX / 12) * opp.ghostPath.length)));
          const oppPt = opp.ghostPath[idx] || { x: opp.currentX, y: 0 };

          ctx.fillStyle = opp.color;
          ctx.beginPath();
          ctx.arc(toCanvasX(oppPt.x), toCanvasY(oppPt.y), 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
          ctx.font = "bold 11px sans-serif";
          ctx.fillText(opp.name, toCanvasX(oppPt.x) + 10, toCanvasY(oppPt.y) + 4);
        }
      });
    }

    // 5. Past Player paths
    segments.forEach((seg) => {
      ctx.strokeStyle = seg.bounced ? "#e11d48" : "#8b5cf6"; // rose if bounced, violet if perfect
      ctx.lineWidth = 4;
      ctx.beginPath();
      seg.points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(toCanvasX(pt.x), toCanvasY(pt.y));
        else ctx.lineTo(toCanvasX(pt.x), toCanvasY(pt.y));
      });
      ctx.stroke();
    });

    // 6. Preview Line (While typing)
    if (!isLaunching && equationText && !parserError) {
      try {
        const fn = parseEquation(equationText);
        // Pre-evaluate bouncing path
        const preview = calculateBouncingTrajectory(currentPos, fn, power, activeMap.obstacles);
        
        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        preview.points.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(toCanvasX(pt.x), toCanvasY(pt.y));
          else ctx.lineTo(toCanvasX(pt.x), toCanvasY(pt.y));
        });
        ctx.stroke();
        ctx.setLineDash([]);
      } catch (e) {
        // Ignore preview parse errors
      }
    }

    // 7. Active launching line
    if (isLaunching && animationPoints.length > 0) {
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 4;
      ctx.beginPath();
      const drawLimit = activeAnimationIndex === -1 ? animationPoints.length : activeAnimationIndex;
      for (let i = 0; i < drawLimit; i++) {
        const pt = animationPoints[i];
        if (i === 0) ctx.moveTo(toCanvasX(pt.x), toCanvasY(pt.y));
        else ctx.lineTo(toCanvasX(pt.x), toCanvasY(pt.y));
      }
      ctx.stroke();
    }

    // 8. Player Circle Particle
    const drawPos = isLaunching && activeAnimationIndex !== -1 && animationPoints[activeAnimationIndex]
      ? animationPoints[activeAnimationIndex]
      : currentPos;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(toCanvasX(drawPos.x), toCanvasY(drawPos.y), 10.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = "#06b6d4";
    ctx.beginPath();
    ctx.arc(toCanvasX(drawPos.x), toCanvasY(drawPos.y), 4, 0, Math.PI * 2);
    ctx.fill();

  }, [
    segments,
    currentPos,
    isLaunching,
    animationPoints,
    activeAnimationIndex,
    equationText,
    power,
    parserError,
    activeMap,
    mode,
    lobbyPlayers,
  ]);

  // ----------------------------------------------------
  // Launch Equation
  // ----------------------------------------------------
  const handleLaunch = () => {
    if (isLaunching) return;
    setParserError(null);

    let parsedFn: (dx: number) => number;
    try {
      parsedFn = parseEquation(equationText);
    } catch (err: any) {
      setParserError(err.message || "Invalid syntax.");
      return;
    }

    setIsLaunching(true);
    // Trace trajectory with elastic bounces
    const { points: trajectoryPoints, bounced } = calculateBouncingTrajectory(
      currentPos,
      parsedFn,
      power,
      activeMap.obstacles
    );

    setAnimationPoints(trajectoryPoints);
    setActiveAnimationIndex(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx >= trajectoryPoints.length) {
        clearInterval(interval);

        const finalPos = trajectoryPoints[trajectoryPoints.length - 1];
        const newSeg: GraphSegment = {
          equation: equationText,
          points: trajectoryPoints,
          bounced,
        };

        setSegments((prev) => [...prev, newSeg]);
        setCurrentPos(finalPos);
        setEquationText("");

        setIsLaunching(false);
        setActiveAnimationIndex(-1);

        if (branch === "projection") {
          setProjectionMovesLeft((m) => m - 1);
        }

        // Check completion criteria
        if (branch === "breakpoint" && finalPos.x >= 10.0) {
          handleGameOver(true, finalPos.x);
        } else if (branch === "arena" && finalPos.x >= 10.0) {
          handleGameOver(true, finalPos.x);
        } else if (branch === "projection" && projectionMovesLeft === 1) {
          // Last move consumed
          handleGameOver(true, finalPos.x);
        }
      } else {
        setActiveAnimationIndex(idx);
      }
    }, 15);

    setLaunchTimer(interval as any);
  };

  // ----------------------------------------------------
  // End game logic
  // ----------------------------------------------------
  const handleGameOver = (completed: boolean, finalX: number) => {
    setPhase("gameover");

    if (branch === "breakpoint" && completed) {
      const finalTime = elapsedMs;
      const currentBest = bestTimes[selectedMapId] || 999999;
      if (finalTime < currentBest) {
        const next = { ...bestTimes, [selectedMapId]: finalTime };
        setBestTimes(next);
        localStorage.setItem("convexity-deadend-best-times", JSON.stringify(next));
      }
    } else if (branch === "projection") {
      const currentBest = bestProjections[selectedMapId] || 0;
      if (finalX > currentBest) {
        const next = { ...bestProjections, [selectedMapId]: finalX };
        setBestProjections(next);
        localStorage.setItem("convexity-deadend-best-projections", JSON.stringify(next));
      }
    } else if (branch === "arena" && completed) {
      // Completed current level, increment unlocked
      const nextLevel = arenaLevel + 1;
      if (nextLevel <= 50) {
        setArenaLevel(nextLevel);
        localStorage.setItem("convexity-deadend-arena-level", String(nextLevel));
      }
    }
  };

  // ----------------------------------------------------
  // Chat Actions
  // ----------------------------------------------------
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { author: profile.name, text: chatInput.trim() }]);
    setChatInput("");
  };

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2) + "s";
  };

  const leaderboardList = useMemo(() => {
    const list = [
      { name: "You", progress: currentPos.x, time: elapsedMs, isYou: true, color: "#06b6d4" },
      ...lobbyPlayers.map((p) => ({
        name: p.name,
        progress: p.currentX,
        time: p.timeFinished || elapsedMs,
        isYou: false,
        color: p.color,
      })),
    ];
    if (branch === "breakpoint") {
      return list.sort((a, b) => {
        const finA = a.progress >= 10.0;
        const finB = b.progress >= 10.0;
        if (finA && finB) return a.time - b.time;
        if (finA) return -1;
        if (finB) return 1;
        return b.progress - a.progress;
      });
    }
    return list.sort((a, b) => b.progress - a.progress);
  }, [lobbyPlayers, currentPos, elapsedMs, branch]);

  // Back arrow navigator handles state transitions
  const handleBackArrow = () => {
    if (phase !== "menu") {
      setPhase("menu");
    } else {
      // Goto games hub
      window.location.href = "/games";
    }
  };

  return (
    <PageShell noScroll={false}>
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Navigation Arrow */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackArrow}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
          >
            ← {phase === "menu" ? "Games Hub" : "Dead End Menu"}
          </button>
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-405">
              Dead End Game mode
            </span>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* Phase: MAIN MENU - Horizontal Branches Overhaul */}
        {/* -------------------------------------------------- */}
        {phase === "menu" && (
          <div className="space-y-6">
            
            {/* Intro Header */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">Dead End</h1>
              <p className="text-sm text-slate-500 max-w-xl">
                Guide a particle around challenging obstacles using mathematical equations. Choose your track below to play.
              </p>
            </div>

            {/* Horizontal Branch Options (Projection, Breakpoint, Arena) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Projection */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-205 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-md backdrop-blur-md">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">📐</span>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-cyan-605">Projection</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">Distance Challenge</h3>
                  <p className="text-xs text-slate-500">
                    Get as far as possible from the starting line using exactly 3 graph segments. Bounce physics are fully enabled.
                  </p>
                  
                  {/* High Scores list */}
                  <div className="border-t border-slate-100 dark:border-white/5 pt-3 space-y-2.5">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Daily Map Records</p>
                    <div className="flex justify-between text-xs pb-1">
                      <span className="text-slate-400">Furthest Reach:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {bestProjections["zigzag"] ? bestProjections["zigzag"].toFixed(2) + "m" : "--"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => {
                      setBranch("projection");
                      setMode("single");
                      setPhase("playing");
                      startGameplay();
                    }}
                    className="flex-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 text-xs transition active:scale-[0.98] cursor-pointer"
                  >
                    Play Single
                  </button>
                  <button
                    onClick={() => {
                      setBranch("projection");
                      setMode("multiplayer");
                      setPhase("matchmaking");
                    }}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition active:scale-[0.98] cursor-pointer"
                    title="Play Multiplayer"
                  >
                    ⚔️
                  </button>
                </div>
              </div>

              {/* Card 2: Breakpoint */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-205 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-md backdrop-blur-md">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">⚡</span>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-cyan-605">Breakpoint</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">Speed Arithmetic Race</h3>
                  <p className="text-xs text-slate-500">
                    Race your particle to the finish line (x = 10) as fast as possible. Obstacles reflect your path with zero penalties.
                  </p>

                  <div className="border-t border-slate-100 dark:border-white/5 pt-3 space-y-2.5">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Daily Map Records</p>
                    <div className="flex justify-between text-xs pb-1">
                      <span className="text-slate-400">Best Race Time:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {bestTimes["zigzag"] ? formatTime(bestTimes["zigzag"]) : "--"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => {
                      setBranch("breakpoint");
                      setMode("single");
                      setPhase("playing");
                      startGameplay();
                    }}
                    className="flex-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 text-xs transition active:scale-[0.98] cursor-pointer"
                  >
                    Play Single
                  </button>
                  <button
                    onClick={() => {
                      setBranch("breakpoint");
                      setMode("multiplayer");
                      setPhase("matchmaking");
                    }}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition active:scale-[0.98] cursor-pointer"
                    title="Play Multiplayer"
                  >
                    ⚔️
                  </button>
                </div>
              </div>

              {/* Card 3: Arena */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-205 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-md backdrop-blur-md">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🏆</span>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-cyan-605">Arena</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">50-Level Campaign</h3>
                  <p className="text-xs text-slate-500">
                    A campaign of 50 progressively harder maps. Complete each level's course to unlock the next challenge.
                  </p>

                  <div className="border-t border-slate-100 dark:border-white/5 pt-3 space-y-2.5">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Campaign Progress</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Current Level:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">Level {arenaLevel} / 50</span>
                      </div>
                      {/* Custom clean progress bar */}
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 transition-all duration-300"
                          style={{ width: `${(arenaLevel / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      setBranch("arena");
                      setMode("single");
                      setPhase("playing");
                      startGameplay();
                    }}
                    className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 text-xs transition active:scale-[0.98] cursor-pointer"
                  >
                    Play Level {arenaLevel}
                  </button>
                </div>
              </div>

            </div>

            {/* Instructions */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-sm backdrop-blur-md">
              <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white mb-2.5">How Graphing Physics Work</h3>
              <div className="text-xs text-slate-500 space-y-2 leading-relaxed">
                <p>
                  • Input a function of <code>x</code> representing the change in position (e.g. <code>sin(x)</code> or <code>x^-2</code>).
                </p>
                <p>
                  • Bounces are fully elastic! The particle bounces off pink barriers and boundary edges and continues along the reflected path.
                </p>
                <p>
                  • Move origin is relative: the graph always operates centered from the particle's current coordinate.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* Phase: MATCHMAKING */}
        {/* -------------------------------------------------- */}
        {phase === "matchmaking" && (
          <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block relative">
                <div className="animate-ping absolute inset-0 h-10 w-10 rounded-full bg-cyan-500 opacity-20 mx-auto" />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-lg mx-auto">
                  ⚡
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-955 dark:text-white">Lobby Matchmaking</h2>
              <p className="text-xs text-slate-500">Searching for graph competitors on {activeMap.name}...</p>
              <p className="text-xs font-mono text-cyan-600 dark:text-cyan-405">Searching time: {matchmakingTime}s</p>
            </div>

            <div className="border-t border-slate-200 dark:border-white/5 pt-4 space-y-3">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Players Joined ({lobbyPlayers.length + 1}/8)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="font-semibold text-slate-850 dark:text-slate-100 text-xs">{profile.name} (You)</span>
                  </div>
                  <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded">
                    Ranked
                  </span>
                </div>

                {lobbyPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: player.color }} />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-550">{player.country}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {player.elo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* Phase: COUNTDOWN */}
        {/* -------------------------------------------------- */}
        {phase === "countdown" && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400">Match Starts In</h2>
            <div className="text-8xl font-serif font-black text-slate-900 dark:text-white animate-bounce">
              {countdownTime}
            </div>
            <p className="text-sm text-slate-500">Entering daily course: {activeMap.name}</p>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* Phase: PLAYING / GAMEOVER */}
        {/* -------------------------------------------------- */}
        {(phase === "playing" || phase === "gameover") && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            
            {/* Play Canvas area */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-450 dark:text-slate-400">Course</p>
                    <p className="text-sm font-serif font-bold text-slate-900 dark:text-white">{activeMap.name}</p>
                  </div>
                  <div className="border-l border-slate-200 dark:border-white/5 pl-4">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-450 dark:text-slate-400">Coordinate</p>
                    <p className="text-sm font-mono font-bold text-cyan-650 dark:text-cyan-400">
                      ({currentPos.x.toFixed(2)}, {currentPos.y.toFixed(2)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {branch !== "projection" ? (
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-slate-450 dark:text-slate-400">Elapsed Time</p>
                      <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{formatTime(elapsedMs)}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-slate-450 dark:text-slate-400">Launches Remaining</p>
                      <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{projectionMovesLeft} / 3</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Canvas viewport */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="w-full aspect-[2/1] bg-slate-950 rounded-2xl border border-slate-250 dark:border-slate-800 shadow-2xl overflow-hidden block"
                />
              </div>

              {/* Inputs */}
              {phase === "playing" && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-md backdrop-blur-md space-y-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleLaunch();
                    }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                      <div className="flex-1 min-w-0 relative">
                        <span className="absolute left-3.5 top-2.5 text-xs font-mono text-slate-450 select-none">
                          y = f(dx) =
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. sin(x)  or  2*x^-2  or  -0.1*x^2"
                          value={equationText}
                          onChange={(e) => {
                            setEquationText(e.target.value);
                            setParserError(null);
                          }}
                          disabled={isLaunching}
                          className="w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955 pl-24 pr-4 py-2.5 text-xs font-mono text-slate-850 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLaunching || !equationText.trim()}
                        className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-6 py-2.5 shadow transition-colors active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        {isLaunching ? "Simulating..." : "🚀 Launch Particle"}
                      </button>
                    </div>

                    {/* Power/Distance limit slider */}
                    <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Launch Power (Max Path Distance):
                      </label>
                      <input
                        type="range"
                        min="1.0"
                        max="15.0"
                        step="0.5"
                        value={power}
                        onChange={(e) => setPower(parseFloat(e.target.value))}
                        disabled={isLaunching}
                        className="flex-1 accent-cyan-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 w-10 text-right">
                        {power.toFixed(1)}
                      </span>
                    </div>
                  </form>

                  {parserError && (
                    <p className="text-[11px] text-red-500 font-mono">
                      ⚠️ Parser Error: {parserError}
                    </p>
                  )}

                  {/* Helpers toolbar */}
                  <div className="flex flex-wrap gap-1.5 border-t border-slate-200/50 dark:border-white/5 pt-3.5">
                    {["x", "sin(x)", "cos(x)", "sqrt(x)", "x^-2", "pi", "*", "/"].map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => {
                          setEquationText((prev) => prev + (prev.endsWith(" ") || prev === "" ? "" : " ") + sym);
                          setParserError(null);
                        }}
                        disabled={isLaunching}
                        className="rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-2.5 py-1 text-[10px] font-mono text-slate-700 dark:text-slate-350 cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={startGameplay}
                      disabled={isLaunching}
                      className="ml-auto rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1 text-[10px] font-semibold text-red-650 hover:bg-red-500/10 cursor-pointer"
                    >
                      🔄 Reset Path
                    </button>
                  </div>
                </div>
              )}

              {/* Game Over Panel */}
              {phase === "gameover" && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4 text-center">
                  <span className="text-3xl">🏆</span>
                  <h3 className="font-serif text-2xl font-bold text-white">Course Resolved</h3>
                  
                  <div className="max-w-xs mx-auto border-t border-b border-white/5 py-4 space-y-2 text-xs">
                    <p className="text-slate-400">
                      Map: <span className="text-white font-medium">{activeMap.name}</span>
                    </p>
                    {branch === "breakpoint" ? (
                      <p className="text-sm font-semibold text-white">
                        Race Time: <span className="font-mono text-cyan-400">{formatTime(elapsedMs)}</span>
                      </p>
                    ) : branch === "projection" ? (
                      <p className="text-sm font-semibold text-white">
                        Furthest Reach: <span className="font-mono text-cyan-400">{currentPos.x.toFixed(2)}m</span>
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-white text-emerald-400">
                        Level {arenaLevel - 1} Completed! Unlocked Level {arenaLevel}.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={() => {
                        setPhase("playing");
                        startGameplay();
                      }}
                      className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs px-5 py-2.5 transition active:scale-[0.98]"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={() => setPhase("menu")}
                      className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-5 py-2.5 font-semibold transition active:scale-[0.98]"
                    >
                      Return to Menu
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar (Leaderboard + Chat) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-md backdrop-blur-md space-y-4">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Rankings Scoreboard</h3>
                
                <div className="space-y-2.5">
                  {leaderboardList.map((player, idx) => (
                    <div
                      key={player.name}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                        player.isYou
                          ? "border-cyan-500/40 bg-cyan-500/5"
                          : "border-slate-200/50 dark:border-white/5 bg-slate-50/20 dark:bg-slate-950/10"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[10px] text-slate-450 w-4">
                          {idx + 1}.
                        </span>
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="font-semibold truncate text-slate-850 dark:text-slate-205">
                          {player.name} {player.isYou && "(You)"}
                        </span>
                      </div>
                      
                      <div className="text-right font-mono font-bold shrink-0 text-slate-900 dark:text-white">
                        {branch === "breakpoint" ? (
                          player.progress >= 10.0 ? (
                            <span className="text-emerald-500">{formatTime(player.time)}</span>
                          ) : (
                            <span className="text-slate-500">{player.progress.toFixed(1)}m / 10m</span>
                          )
                        ) : (
                          <span className="text-cyan-600 dark:text-cyan-400">{player.progress.toFixed(2)}m</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {mode === "multiplayer" && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-md backdrop-blur-md flex flex-col h-[280px]">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3 shrink-0">Live Chat</h3>
                  
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                    {chatMessages.length === 0 ? (
                      <p className="text-slate-400 italic text-[11px] text-center pt-8">No messages. Type below to say hi!</p>
                    ) : (
                      chatMessages.map((msg, idx) => (
                        <div key={idx} className="space-y-0.5 animate-in fade-in duration-200">
                          <span className="font-semibold text-cyan-600 dark:text-cyan-400">{msg.author}: </span>
                          <span className="text-slate-700 dark:text-slate-350">{msg.text}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleSendChat} className="mt-3 flex gap-2 shrink-0">
                    <input
                      type="text"
                      placeholder="Say hello..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="min-w-0 flex-1 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-505"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs px-3 py-1.5 transition active:scale-[0.98] cursor-pointer"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </PageShell>
  );
}
