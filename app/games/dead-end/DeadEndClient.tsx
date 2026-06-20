"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { PageShell } from "../../components/PageShell";
import { useAuth } from "../../components/AuthContext";
import { loadProfile, saveProfile, type UserProfile, DEFAULT_PROFILE } from "@/lib/user-settings";

// ----------------------------------------------------
// Type Definitions
// ----------------------------------------------------
type BranchType = "projection" | "breakpoint";
type PlayMode = "single" | "multiplayer";
type GamePhase = "menu" | "matchmaking" | "countdown" | "playing" | "gameover";

type Obstacle =
  | { type: "rect"; x1: number; y1: number; x2: number; y2: number }
  | { type: "circle"; cx: number; cy: number; r: number };

type Point = { x: number; y: number };

type GraphSegment = {
  equation: string;
  points: Point[];
  crashed: boolean;
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
  typingProgress: number;      // Matchmaking / simulation state
};

// ----------------------------------------------------
// Maps & Obstacle Layouts
// ----------------------------------------------------
type GameMap = {
  id: string;
  name: string;
  description: string;
  obstacles: Obstacle[];
};

const GAME_MAPS: GameMap[] = [
  {
    id: "zigzag",
    name: "The Zigzag Alley",
    description: "Navigate around alternating top and bottom vertical walls.",
    obstacles: [
      { type: "rect", x1: 3.0, y1: -6.0, x2: 4.2, y2: 1.5 },
      { type: "rect", x1: 7.0, y1: -1.5, x2: 8.2, y2: 6.0 },
    ],
  },
  {
    id: "needle",
    name: "Eye of the Needle",
    description: "Squeeze through a tight central gap and steer around a circular core.",
    obstacles: [
      { type: "rect", x1: 4.0, y1: -6.0, x2: 5.0, y2: -1.0 },
      { type: "rect", x1: 4.0, y1: 1.0, x2: 5.0, y2: 6.0 },
      { type: "circle", cx: 8.0, cy: 0.0, r: 1.4 },
    ],
  },
  {
    id: "maze",
    name: "The Maze Runner",
    description: "A narrow winding corridor requiring precision turns.",
    obstacles: [
      { type: "rect", x1: 2.5, y1: -3.0, x2: 3.5, y2: 6.0 },
      { type: "rect", x1: 5.5, y1: -6.0, x2: 6.5, y2: 3.0 },
      { type: "rect", x1: 8.5, y1: -3.0, x2: 9.5, y2: 6.0 },
    ],
  },
];

// ----------------------------------------------------
// Parser Implementation
// ----------------------------------------------------
function parseEquation(input: string): (dx: number) => number {
  let cleaned = input.trim().toLowerCase();
  cleaned = cleaned.replace(/^(y|f\(dx\))\s*=\s*/, "");
  
  if (!cleaned) {
    throw new Error("Equation is empty.");
  }
  
  // Safe characters/tokens check
  const validationStr = cleaned
    .replace(/sin|cos|tan|sqrt|log|ln|exp|abs|pi|e/g, "")
    .replace(/[0-9x+\-*/().\s^%]/g, "");
  
  if (validationStr.length > 0) {
    throw new Error(`Invalid syntax or character: "${validationStr[0]}"`);
  }
  
  let jsExpr = cleaned;
  jsExpr = jsExpr.replace(/\b(sin|cos|tan|sqrt|log|exp|abs)\b/g, "Math.$1");
  jsExpr = jsExpr.replace(/\bln\b/g, "Math.log");
  jsExpr = jsExpr.replace(/\bpi\b/g, "Math.PI");
  jsExpr = jsExpr.replace(/\be\b/g, "Math.E");
  jsExpr = jsExpr.replace(/\^/g, "**");
  
  // Implicit multiplication: "2x" -> "2*x", "(x)(x)" -> "(x)*(x)", "x(" -> "x*("
  jsExpr = jsExpr.replace(/(\d)(x)/g, "$1*$2");
  jsExpr = jsExpr.replace(/(\d|\))(\()/g, "$1*$2");
  jsExpr = jsExpr.replace(/(x)(\()/g, "$1*$2");
  jsExpr = jsExpr.replace(/(x)(\d)/g, "$1*$2");
  
  // Create relative function where input "x" acts as "dx"
  try {
    const fn = new Function("x", `return ${jsExpr};`);
    const testVal = fn(1);
    if (isNaN(testVal) || !isFinite(testVal)) {
      // Allow execution but flag it
    }
    return fn as (x: number) => number;
  } catch (err) {
    throw new Error("Syntax error. Try using '*' explicitly e.g. 2*x.");
  }
}

// ----------------------------------------------------
// Collision Detection
// ----------------------------------------------------
function checkCollision(p: Point, obstacles: Obstacle[]): boolean {
  for (const obs of obstacles) {
    if (obs.type === "rect") {
      const minX = Math.min(obs.x1, obs.x2);
      const maxX = Math.max(obs.x1, obs.x2);
      const minY = Math.min(obs.y1, obs.y2);
      const maxY = Math.max(obs.y1, obs.y2);
      if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) {
        return true;
      }
    } else if (obs.type === "circle") {
      const dx = p.x - obs.cx;
      const dy = p.y - obs.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= obs.r) {
        return true;
      }
    }
  }
  return false;
}

export function DeadEndClient() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Game setup states
  const [branch, setBranch] = useState<BranchType>("projection");
  const [mode, setMode] = useState<PlayMode>("single");
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [selectedMapId, setSelectedMapId] = useState("zigzag");

  // High score tracking
  const [bestTimes, setBestTimes] = useState<Record<string, number>>({}); // mapId -> timeMs
  const [bestProjections, setBestProjections] = useState<Record<string, number>>({}); // mapId -> distance

  // Matchmaking lobby states
  const [matchmakingTime, setMatchmakingTime] = useState(0);
  const [lobbyPlayers, setLobbyPlayers] = useState<SimulatedPlayer[]>([]);
  const [countdownTime, setCountdownTime] = useState(3);

  // Active game states
  const [equationText, setEquationText] = useState("");
  const [parserError, setParserError] = useState<string | null>(null);
  
  const [currentPos, setCurrentPos] = useState<Point>({ x: 0, y: 0 });
  const [segments, setSegments] = useState<GraphSegment[]>([]);
  const [animationPoints, setAnimationPoints] = useState<Point[]>([]);
  const [activeAnimationIndex, setActiveAnimationIndex] = useState(-1);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchTimer, setLaunchTimer] = useState<number | null>(null);
  
  // Game metrics
  const [elapsedMs, setElapsedMs] = useState(0);
  const [raceFinished, setRaceFinished] = useState(false);
  const [timePenalty, setTimePenalty] = useState(0); // in seconds
  const [projectionMovesLeft, setProjectionMovesLeft] = useState(3);

  // Chat lobby state
  const [chatMessages, setChatMessages] = useState<{ author: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeMap = GAME_MAPS.find((m) => m.id === selectedMapId) || GAME_MAPS[0];

  // ----------------------------------------------------
  // Load settings and profile
  // ----------------------------------------------------
  useEffect(() => {
    setProfile(loadProfile());
    
    // Load local highscores
    const savedTimesStr = localStorage.getItem("convexity-deadend-best-times");
    if (savedTimesStr) {
      try { setBestTimes(JSON.parse(savedTimesStr)); } catch (e) { console.error(e); }
    }
    const savedProjStr = localStorage.getItem("convexity-deadend-best-projections");
    if (savedProjStr) {
      try { setBestProjections(JSON.parse(savedProjStr)); } catch (e) { console.error(e); }
    }
  }, []);

  // ----------------------------------------------------
  // Matchmaking Simulation
  // ----------------------------------------------------
  useEffect(() => {
    if (phase !== "matchmaking") return;
    
    setMatchmakingTime(0);
    setLobbyPlayers([]);
    
    const interval = setInterval(() => {
      setMatchmakingTime((t) => t + 1);
    }, 1000);

    const opponentPool = [
      { name: "EulerFan", country: "Germany", elo: 1240, color: "#ec4899" },
      { name: "PrimeHunter", country: "United Kingdom", elo: 1380, color: "#10b981" },
      { name: "Sofia", country: "Spain", elo: 1190, color: "#f59e0b" },
      { name: "Marcus", country: "Canada", elo: 1210, color: "#3b82f6" },
      { name: "CalculusLord", country: "France", elo: 1310, color: "#8b5cf6" },
      { name: "MatrixRef", country: "United States", elo: 1150, color: "#06b6d4" },
    ];

    // Shuffle opponents
    const shuffled = [...opponentPool].sort(() => Math.random() - 0.5);

    // Simulate player joins
    const timeouts: NodeJS.Timeout[] = [];
    const joined: SimulatedPlayer[] = [];

    const numPlayers = 3 + Math.floor(Math.random() * 5); // 3 to 7 opponents

    for (let i = 0; i < numPlayers; i++) {
      const delay = 1000 + i * (1500 + Math.random() * 1500);
      const to = setTimeout(() => {
        const opp = shuffled[i % shuffled.length];
        
        // Generate pre-simulated ghost trajectories
        const ghostPath: Point[] = [];
        let curX = 0;
        let curY = 0;
        ghostPath.push({ x: curX, y: curY });
        
        // Create a sensible trajectory around map obstacles
        if (selectedMapId === "zigzag") {
          // Path designed to go up and over barrier 1 (x=3-4.2, y=-6 to 1.5)
          // and down/under barrier 2 (x=7-8.2, y=-1.5 to 6)
          while (curX < 12) {
            curX += 0.15;
            if (curX < 3.0) {
              curY = curX * 0.7; // Go up
            } else if (curX >= 3.0 && curX < 6.0) {
              curY = 2.0 - (curX - 3.0) * 0.5; // Slope down slightly
            } else if (curX >= 6.0 && curX < 8.0) {
              curY = 0.5 - (curX - 6.0) * 1.5; // Go down sharply
            } else {
              curY = -2.5 + (curX - 8.0) * 0.8; // Level off
            }
            ghostPath.push({ x: curX, y: curY });
          }
        } else if (selectedMapId === "needle") {
          // Squeeze center gap (x=4-5, y=-1 to 1) and circle at (8,0, r=1.4)
          while (curX < 12) {
            curX += 0.15;
            if (curX < 4.0) {
              curY = 0.0; // Straight
            } else if (curX >= 4.0 && curX < 6.0) {
              curY = 0.0; // Squeeze center
            } else if (curX >= 6.0 && curX < 9.0) {
              curY = Math.sin((curX - 6.0) * Math.PI / 3) * 2.2; // Wavy dodge circle
            } else {
              curY = 0.0;
            }
            ghostPath.push({ x: curX, y: curY });
          }
        } else {
          // Maze Runner
          while (curX < 12) {
            curX += 0.15;
            if (curX < 2.5) {
              curY = -4.5;
            } else if (curX >= 2.5 && curX < 5.5) {
              curY = 4.5;
            } else if (curX >= 5.5 && curX < 8.5) {
              curY = -4.5;
            } else {
              curY = 4.5;
            }
            ghostPath.push({ x: curX, y: curY });
          }
        }

        const newPlayer: SimulatedPlayer = {
          id: `sim-${Date.now()}-${i}`,
          name: opp.name,
          country: opp.country,
          elo: opp.elo,
          color: opp.color,
          currentX: 0,
          timeFinished: null,
          maxProjection: 0,
          ghostPath,
          typingProgress: 0,
        };
        joined.push(newPlayer);
        setLobbyPlayers([...joined]);

        // Trigger lobby messages
        const chatMsgs = [
          "GLHF!",
          "Dead End is so fun!",
          "This map looks intense",
          "Hey everyone",
          "Let's go!",
        ];
        if (Math.random() > 0.4) {
          setChatMessages((prev) => [
            ...prev,
            { author: opp.name, text: chatMsgs[Math.floor(Math.random() * chatMsgs.length)] },
          ]);
        }
      }, delay);
      timeouts.push(to);
    }

    // Matchmaking completes after 8 seconds
    const completionTimeout = setTimeout(() => {
      setPhase("countdown");
    }, 9000);

    return () => {
      clearInterval(interval);
      timeouts.forEach((to) => clearTimeout(to));
      clearTimeout(completionTimeout);
    };
  }, [phase, selectedMapId]);

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
  // Simulated Multiplayer opponent progress updates
  // ----------------------------------------------------
  useEffect(() => {
    if (phase !== "playing" || mode !== "multiplayer") return;

    const interval = setInterval(() => {
      setLobbyPlayers((players) =>
        players.map((p) => {
          if (branch === "breakpoint") {
            if (p.timeFinished !== null) return p;
            
            // Opponent progress speed
            const speedFactor = 0.08 + (p.elo - 1100) * 0.0001;
            const nextX = Math.min(12, p.currentX + speedFactor + (Math.random() * 0.04 - 0.02));
            const finished = nextX >= 10;
            return {
              ...p,
              currentX: nextX,
              timeFinished: finished ? elapsedMs : null,
            };
          } else {
            // Projection mode
            if (p.maxProjection >= 10.0) return p;
            // Simulated players take 3 steps over the game
            const stepChance = Math.random() < 0.05;
            if (stepChance) {
              const addProj = 2.0 + Math.random() * 1.5;
              const nextProj = Math.min(10.0, p.maxProjection + addProj);
              return {
                ...p,
                maxProjection: nextProj,
                currentX: nextProj,
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
  // Main Game Loop Timer
  // ----------------------------------------------------
  useEffect(() => {
    if (phase !== "playing") return;

    const start = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - start + timePenalty * 1000);
    }, 50);

    return () => clearInterval(interval);
  }, [phase, timePenalty]);

  // ----------------------------------------------------
  // Initialize Gameplay parameters
  // ----------------------------------------------------
  const startGameplay = () => {
    setCurrentPos({ x: 0, y: 0 });
    setSegments([]);
    setEquationText("");
    setParserError(null);
    setElapsedMs(0);
    setTimePenalty(0);
    setRaceFinished(false);
    setProjectionMovesLeft(3);
    setIsLaunching(false);
    if (launchTimer) clearInterval(launchTimer);
  };

  // ----------------------------------------------------
  // Physics Render Hook (Grid, Obstacles, Lines, Particles)
  // ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset size to support retina/scaling
    const dpr = window.devicePixelRatio || 1;
    const width = 1200;
    const height = 600;
    
    canvas.width = width;
    canvas.height = height;
    ctx.scale(1, 1);

    // Coordinate conversions
    // Canvas ranges: X [0, width] -> [0, 12] coordinate space
    // Canvas ranges: Y [0, height] -> [-6, 6] coordinate space
    const toCanvasX = (cx: number) => (cx / 12) * width;
    const toCanvasY = (cy: number) => ((6 - cy) / 12) * height;

    // 1. Draw Clean Dark Background Grid
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    // Draw vertical/horizontal grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;

    // Verticals
    for (let x = 0; x <= 12; x++) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(x), 0);
      ctx.lineTo(toCanvasX(x), height);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "14px monospace";
      ctx.fillText(x.toString(), toCanvasX(x) - 5, height - 10);
    }
    
    // Horizontals
    for (let y = -6; y <= 6; y++) {
      ctx.beginPath();
      ctx.moveTo(0, toCanvasY(y));
      ctx.lineTo(width, toCanvasY(y));
      ctx.stroke();

      if (y !== 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.font = "14px monospace";
        ctx.fillText(y.toString(), 10, toCanvasY(y) + 5);
      }
    }

    // Draw coordinate axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, toCanvasY(0));
    ctx.lineTo(width, toCanvasY(0));
    ctx.stroke();

    // 2. Draw Start/Finish Areas
    // Start at x=0
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
    ctx.fillRect(0, 0, toCanvasX(0.5), height);
    ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0.5), 0);
    ctx.lineTo(toCanvasX(0.5), height);
    ctx.stroke();
    
    // Finish line at x=10
    ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
    ctx.fillRect(toCanvasX(10), 0, width - toCanvasX(10), height);
    
    // Checkered line at x=10
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 4;
    ctx.setLineDash([15, 10]);
    ctx.beginPath();
    ctx.moveTo(toCanvasX(10), 0);
    ctx.lineTo(toCanvasX(10), height);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Labels for zones
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("START", 10, 30);

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

        const canvasX = toCanvasX(xMin);
        const canvasY = toCanvasY(yMin + h); // In canvas space Y is top-down
        const canvasW = toCanvasX(xMin + w) - canvasX;
        const canvasH = toCanvasY(yMin) - canvasY;

        // Gradient glass fill
        const grad = ctx.createLinearGradient(canvasX, canvasY, canvasX + canvasW, canvasY + canvasH);
        grad.addColorStop(0, "rgba(239, 68, 68, 0.25)");
        grad.addColorStop(1, "rgba(239, 68, 68, 0.05)");
        
        ctx.fillStyle = grad;
        ctx.fillRect(canvasX, canvasY, canvasW, canvasH);
        
        ctx.strokeStyle = "rgba(239, 68, 68, 0.85)";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(canvasX, canvasY, canvasW, canvasH);
      } else if (obs.type === "circle") {
        const canvasCX = toCanvasX(obs.cx);
        const canvasCY = toCanvasY(obs.cy);
        const canvasR = (obs.r / 12) * width;

        const grad = ctx.createRadialGradient(canvasCX, canvasCY, 5, canvasCX, canvasCY, canvasR);
        grad.addColorStop(0, "rgba(239, 68, 68, 0.3)");
        grad.addColorStop(1, "rgba(239, 68, 68, 0.05)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(canvasCX, canvasCY, canvasR, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(239, 68, 68, 0.85)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(canvasCX, canvasCY, canvasR, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // 4. Draw Opponent Ghost Trails (Multiplayer)
    if (mode === "multiplayer") {
      lobbyPlayers.forEach((opp) => {
        // Trail
        ctx.strokeStyle = opp.color + "25"; // Add low opacity
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        opp.ghostPath.forEach((pt, i) => {
          // Limit to current progress
          if (pt.x > opp.currentX) return;
          if (i === 0) ctx.moveTo(toCanvasX(pt.x), toCanvasY(pt.y));
          else ctx.lineTo(toCanvasX(pt.x), toCanvasY(pt.y));
        });
        ctx.stroke();

        // Ghost Dot
        if (opp.currentX < 12.0) {
          // Interpolate current Y from ghost path
          const closestIndex = Math.min(
            opp.ghostPath.length - 1,
            Math.max(0, Math.floor((opp.currentX / 12.0) * opp.ghostPath.length))
          );
          const oppPt = opp.ghostPath[closestIndex] || { x: opp.currentX, y: 0 };

          ctx.fillStyle = opp.color;
          ctx.beginPath();
          ctx.arc(toCanvasX(oppPt.x), toCanvasY(oppPt.y), 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.font = "bold 11px sans-serif";
          ctx.fillText(opp.name, toCanvasX(oppPt.x) + 12, toCanvasY(oppPt.y) + 4);
        }
      });
    }

    // 5. Draw Player Trails (Past Committed Segments)
    segments.forEach((seg, sIdx) => {
      ctx.strokeStyle = seg.crashed ? "#ef4444" : "#a855f7"; // Red if crashed, purple if solid
      ctx.lineWidth = seg.crashed ? 3 : 4.5;
      
      ctx.beginPath();
      seg.points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(toCanvasX(pt.x), toCanvasY(pt.y));
        else ctx.lineTo(toCanvasX(pt.x), toCanvasY(pt.y));
      });
      ctx.stroke();

      // Crash Marker
      if (seg.crashed && seg.points.length > 0) {
        const lastPt = seg.points[seg.points.length - 1];
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(toCanvasX(lastPt.x), toCanvasY(lastPt.y), 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px monospace";
        ctx.fillText("💥", toCanvasX(lastPt.x) - 7, toCanvasY(lastPt.y) + 4);
      }
    });

    // 6. Draw Active Uncommitted Launching Line
    if (isLaunching && animationPoints.length > 0) {
      ctx.strokeStyle = "#06b6d4"; // Bright cyan for active plotting
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      
      const drawLimit = activeAnimationIndex === -1 ? animationPoints.length : activeAnimationIndex;
      for (let i = 0; i < drawLimit; i++) {
        const pt = animationPoints[i];
        if (i === 0) ctx.moveTo(toCanvasX(pt.x), toCanvasY(pt.y));
        else ctx.lineTo(toCanvasX(pt.x), toCanvasY(pt.y));
      }
      ctx.stroke();
    }

    // 7. Draw Dotted Preview Line (While typing)
    if (!isLaunching && equationText && !parserError) {
      try {
        const fn = parseEquation(equationText);
        const previewPoints: Point[] = [];
        const step = 0.05;
        
        // Draw up to 3.5 units ahead
        for (let dx = 0; dx <= 3.5; dx += step) {
          const px = currentPos.x + dx;
          const py = currentPos.y + fn(dx);
          // Clamp y
          const clampedY = Math.max(-6, Math.min(6, py));
          previewPoints.push({ x: px, y: clampedY });
          
          // Stop drawing preview if it intersects an obstacle
          if (checkCollision({ x: px, y: clampedY }, activeMap.obstacles)) {
            break;
          }
        }

        ctx.strokeStyle = "rgba(6, 182, 212, 0.45)"; // Soft cyan
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        previewPoints.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(toCanvasX(pt.x), toCanvasY(pt.y));
          else ctx.lineTo(toCanvasX(pt.x), toCanvasY(pt.y));
        });
        ctx.stroke();
        ctx.setLineDash([]); // Reset
      } catch (e) {
        // Ignore preview errors
      }
    }

    // 8. Draw Player Active Particle Dot
    const drawPos = isLaunching && activeAnimationIndex !== -1 && animationPoints[activeAnimationIndex]
      ? animationPoints[activeAnimationIndex]
      : currentPos;

    // Glowing cyan particle outer circle
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#06b6d4";
    
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(toCanvasX(drawPos.x), toCanvasY(drawPos.y), 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0; // Reset shadow

    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = "#06b6d4";
    ctx.beginPath();
    ctx.arc(toCanvasX(drawPos.x), toCanvasY(drawPos.y), 4.5, 0, Math.PI * 2);
    ctx.fill();

  }, [
    segments,
    currentPos,
    isLaunching,
    animationPoints,
    activeAnimationIndex,
    equationText,
    parserError,
    activeMap,
    mode,
    lobbyPlayers,
  ]);

  // ----------------------------------------------------
  // Launch Equation Animation
  // ----------------------------------------------------
  const handleLaunch = () => {
    if (isLaunching) return;
    setParserError(null);

    let parsedFn: (x: number) => number;
    try {
      parsedFn = parseEquation(equationText);
    } catch (err: any) {
      setParserError(err.message || "Invalid syntax.");
      return;
    }

    setIsLaunching(true);
    const tracePoints: Point[] = [];
    const step = 0.04;
    const maxDeltaX = 3.5; // limit segment length to 3.5 units
    let crashed = false;
    let collisionPt: Point | null = null;

    for (let dx = 0; dx <= maxDeltaX; dx += step) {
      const px = currentPos.x + dx;
      const py = currentPos.y + parsedFn(dx);
      
      const pt = { x: px, y: py };
      
      // Boundary checks (y clamp)
      if (py > 6.0 || py < -6.0) {
        crashed = true;
        pt.y = Math.max(-6, Math.min(6, py));
        tracePoints.push(pt);
        collisionPt = pt;
        break;
      }
      
      tracePoints.push(pt);

      if (checkCollision(pt, activeMap.obstacles)) {
        crashed = true;
        collisionPt = pt;
        break;
      }
    }

    setAnimationPoints(tracePoints);
    setActiveAnimationIndex(0);

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex += 1;
      if (currentIndex >= tracePoints.length) {
        clearInterval(interval);
        
        // Finalize segment
        const finalPt = tracePoints[tracePoints.length - 1];
        const newSeg: GraphSegment = {
          equation: equationText,
          points: tracePoints,
          crashed,
        };

        setSegments((prev) => [...prev, newSeg]);
        setEquationText("");

        if (crashed) {
          if (branch === "breakpoint") {
            // Penalty reset to segment start
            setTimePenalty((p) => p + 3);
            // Particle remains at start of segment
          } else {
            // Projection consumes move, starts next from crash/collision point
            setCurrentPos(finalPt);
            setProjectionMovesLeft((m) => m - 1);
          }
        } else {
          // Success
          setCurrentPos(finalPt);
          if (branch === "projection") {
            setProjectionMovesLeft((m) => m - 1);
          }
        }

        setIsLaunching(false);
        setActiveAnimationIndex(-1);

        // Check overall end game criteria
        const checkX = finalPt.x;
        if (branch === "breakpoint" && checkX >= 10.0) {
          handleGameOver(true, finalPt.x);
        } else if (branch === "projection" && projectionMovesLeft === 1) {
          // Moves left resolves AFTER state updates, meaning this was the last move
          handleGameOver(true, finalPt.x);
        }
      } else {
        setActiveAnimationIndex(currentIndex);
      }
    }, 20);

    setLaunchTimer(interval as any);
  };

  // ----------------------------------------------------
  // End Game Resolution
  // ----------------------------------------------------
  const handleGameOver = (completed: boolean, finalX: number) => {
    setPhase("gameover");
    
    // Save to local score records
    if (branch === "breakpoint") {
      if (completed) {
        const finalTime = elapsedMs;
        const currentBest = bestTimes[selectedMapId] || 999999;
        if (finalTime < currentBest) {
          const next = { ...bestTimes, [selectedMapId]: finalTime };
          setBestTimes(next);
          localStorage.setItem("convexity-deadend-best-times", JSON.stringify(next));
        }
      }
    } else {
      const currentBest = bestProjections[selectedMapId] || 0;
      if (finalX > currentBest) {
        const next = { ...bestProjections, [selectedMapId]: finalX };
        setBestProjections(next);
        localStorage.setItem("convexity-deadend-best-projections", JSON.stringify(next));
      }
    }
  };

  // ----------------------------------------------------
  // Chat Handlers
  // ----------------------------------------------------
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatMessages((prev) => [
      ...prev,
      { author: profile.name, text: chatInput.trim() },
    ]);
    setChatInput("");
  };

  // ----------------------------------------------------
  // Helper Formatters
  // ----------------------------------------------------
  const formatTime = (ms: number) => {
    const sec = ms / 1000;
    return sec.toFixed(2) + "s";
  };

  // ----------------------------------------------------
  // Lobby / Leaderboard rendering helpers
  // ----------------------------------------------------
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
      // Sort finished first (by time), then by x progress desc
      return list.sort((a, b) => {
        const finishedA = a.progress >= 10.0;
        const finishedB = b.progress >= 10.0;
        if (finishedA && finishedB) return a.time - b.time;
        if (finishedA) return -1;
        if (finishedB) return 1;
        return b.progress - a.progress;
      });
    } else {
      // Sort by progress desc
      return list.sort((a, b) => b.progress - a.progress);
    }
  }, [lobbyPlayers, currentPos, elapsedMs, branch]);

  return (
    <PageShell noScroll={false}>
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Navigation arrow back */}
        <div className="flex items-center justify-between">
          <Link
            href="/games"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ← Games Hub
          </Link>
          <div className="text-right">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-405">
              Dead End Game mode
            </span>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* Phase: MAIN MENU */}
        {/* -------------------------------------------------- */}
        {phase === "menu" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Setup Options Panel */}
            <div className="lg:col-span-1 space-y-5">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-md backdrop-blur-md">
                <h2 className="font-serif text-xl font-bold text-slate-950 dark:text-white">Dead End</h2>
                <p className="text-xs text-slate-500 mt-1">Navigate particles around shapes using graph functions.</p>
                
                {/* Branch Selection */}
                <div className="mt-5 space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400">Game Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBranch("projection")}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition ${
                        branch === "projection"
                          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      📐 Projection
                    </button>
                    <button
                      onClick={() => setBranch("breakpoint")}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition ${
                        branch === "breakpoint"
                          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      ⚡ Breakpoint
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1">
                    {branch === "projection" 
                      ? "Get as far as possible from start using exactly 3 graph segments."
                      : "Race to the finish line (x = 10) as fast as possible. Wall crashes reset segment."}
                  </p>
                </div>

                {/* Matchmaking Lobby Mode */}
                <div className="mt-5 space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400">Match Mode</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMode("single")}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition ${
                        mode === "single"
                          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      👤 Single Player
                    </button>
                    <button
                      onClick={() => setMode("multiplayer")}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition ${
                        mode === "multiplayer"
                          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      ⚔️ Multiplayer (Ranked)
                    </button>
                  </div>
                </div>

                {/* Map selection */}
                <div className="mt-5 space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400">Select Obstacle Map</label>
                  <select
                    value={selectedMapId}
                    onChange={(e) => setSelectedMapId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-medium"
                  >
                    {GAME_MAPS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 italic">
                    {activeMap.description}
                  </p>
                </div>

                {/* Play Trigger */}
                <button
                  onClick={() => {
                    if (mode === "multiplayer") {
                      setPhase("matchmaking");
                    } else {
                      setPhase("playing");
                      startGameplay();
                    }
                  }}
                  className="w-full mt-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 text-xs tracking-wider transition-colors shadow-lg active:scale-[0.98]"
                >
                  {mode === "multiplayer" ? "Find Ranked Lobby (2-8 Players)" : "Start Offline Simulation"}
                </button>
              </div>
            </div>

            {/* Maps & Stats View Grid */}
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-md backdrop-blur-md">
                <h3 className="font-serif text-lg font-bold text-slate-950 dark:text-white mb-4">Personal Best Records</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Projections Card */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-4">
                    <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
                      📐 Furthest Projection (Distance)
                    </h4>
                    <ul className="space-y-2 text-xs">
                      {GAME_MAPS.map((m) => {
                        const score = bestProjections[m.id];
                        return (
                          <li key={m.id} className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-1">
                            <span className="text-slate-600 dark:text-slate-400">{m.name}</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {score ? score.toFixed(2) + "m" : "--"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Breakpoint Card */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-4">
                    <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
                      ⚡ Breakpoint Best Completion Times
                    </h4>
                    <ul className="space-y-2 text-xs">
                      {GAME_MAPS.map((m) => {
                        const time = bestTimes[m.id];
                        return (
                          <li key={m.id} className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-1">
                            <span className="text-slate-600 dark:text-slate-400">{m.name}</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {time ? formatTime(time) : "--"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                </div>
              </div>

              {/* Instructions Panel */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-md backdrop-blur-md">
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2">How to Play</h3>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                  <p>1. Type in equations relative to your current position, e.g. <code>2 * sin(x)</code> or <code>0.1 * x^2</code>.</p>
                  <p>2. The variable <code>x</code> represents the change in horizontal displacement (<code>dx</code>) from the start of the current segment.</p>
                  <p>3. If you crash, your particle halts. Avoid the red obstacle boundaries!</p>
                  <p>4. Breakpoint is a race to <code>x = 10</code>. Crashes cost a 3-second penalty. Projection gives you 3 segments to go as far as possible.</p>
                </div>
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
              <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-white">Lobby Matchmaking</h2>
              <p className="text-xs text-slate-500">Searching for math graphers to compete on {activeMap.name}...</p>
              <p className="text-xs font-mono text-cyan-600 dark:text-cyan-405">Time Elapsed: {matchmakingTime}s</p>
            </div>

            <div className="border-t border-slate-200 dark:border-white/5 pt-4 space-y-3">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Players Joined ({lobbyPlayers.length + 1}/8)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* User */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="font-semibold text-slate-850 dark:text-slate-100 text-xs">{profile.name} (You)</span>
                  </div>
                  <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded">
                    Ranked
                  </span>
                </div>

                {/* Opponents */}
                {lobbyPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: player.color }} />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500">{player.country}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {player.elo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Waiting indicator */}
            <div className="flex justify-center pt-2">
              <span className="text-xs text-slate-400 animate-pulse">Lobby closing in 2-8 players...</span>
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
            <p className="text-sm text-slate-500">Entering map: {activeMap.name}</p>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* Phase: PLAYING / GAMEOVER */}
        {/* -------------------------------------------------- */}
        {(phase === "playing" || phase === "gameover") && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            
            {/* Left side: Canvas Play Area */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Header metrics */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-450 dark:text-slate-400">Map</p>
                    <p className="text-sm font-serif font-bold text-slate-900 dark:text-white">{activeMap.name}</p>
                  </div>
                  <div className="border-l border-slate-200 dark:border-white/5 pl-4">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-450 dark:text-slate-400">Position</p>
                    <p className="text-sm font-mono font-bold text-cyan-650 dark:text-cyan-400">
                      ({currentPos.x.toFixed(2)}, {currentPos.y.toFixed(2)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {branch === "breakpoint" ? (
                    <>
                      <div>
                        <p className="text-[9px] font-mono uppercase tracking-widest text-slate-450 dark:text-slate-400">Elapsed Time</p>
                        <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{formatTime(elapsedMs)}</p>
                      </div>
                      {timePenalty > 0 && (
                        <div className="border-l border-slate-200 dark:border-white/5 pl-4">
                          <p className="text-[9px] font-mono uppercase tracking-widest text-red-500">Penalties</p>
                          <p className="text-sm font-mono font-bold text-red-500">+{timePenalty}s</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-slate-450 dark:text-slate-400">Moves Left</p>
                      <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{projectionMovesLeft} / 3</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Canvas element */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="w-full aspect-[2/1] bg-slate-950 rounded-2xl border border-slate-250 dark:border-slate-800 shadow-2xl overflow-hidden block"
                />
                
                {/* Crash Notification Overlay */}
                {isLaunching && animationPoints.length > 0 && activeAnimationIndex === animationPoints.length - 1 && animationPoints[activeAnimationIndex] && checkCollision(animationPoints[activeAnimationIndex], activeMap.obstacles) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 backdrop-blur-[1px] rounded-2xl animate-pulse">
                    <span className="bg-red-600 text-white font-mono text-sm px-4 py-2 rounded-xl shadow-lg border border-red-400">
                      💥 Obstacle Collision!
                    </span>
                  </div>
                )}
              </div>

              {/* Equation inputs and launchpad controls (Only during play) */}
              {phase === "playing" && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-md backdrop-blur-md space-y-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleLaunch();
                    }}
                    className="flex flex-col sm:flex-row gap-3 items-stretch"
                  >
                    <div className="flex-1 min-w-0 relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-mono text-slate-400 select-none">
                        y = f(dx) =
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. 1.5 * sin(x)  or  0.2 * x^2"
                        value={equationText}
                        onChange={(e) => {
                          setEquationText(e.target.value);
                          setParserError(null);
                        }}
                        disabled={isLaunching}
                        className="w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 pl-24 pr-4 py-2.5 text-xs font-mono text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLaunching || !equationText.trim()}
                      className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-6 py-2.5 shadow transition-colors active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {isLaunching ? (
                        <>
                          <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                          Tracking...
                        </>
                      ) : (
                        <>🚀 Launch Particle</>
                      )}
                    </button>
                  </form>

                  {/* Errors / Warnings */}
                  {parserError && (
                    <p className="text-[11px] text-red-500 font-mono">
                      ⚠️ Parser Error: {parserError}
                    </p>
                  )}

                  {/* Math Symbols Toolbar */}
                  <div className="flex flex-wrap gap-1.5 border-t border-slate-200/50 dark:border-white/5 pt-3.5">
                    {["x", "sin(x)", "cos(x)", "sqrt(x)", "x^2", "pi", "*", "/"].map((sym) => (
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

              {/* Game Over Modal / Summary */}
              {phase === "gameover" && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4 text-center">
                  <span className="text-3xl">🏆</span>
                  <h3 className="font-serif text-2xl font-bold text-white">Simulation Completed</h3>
                  
                  <div className="max-w-xs mx-auto border-t border-b border-white/5 py-4 space-y-2">
                    <p className="text-xs text-slate-400">
                      Map: <span className="text-white font-medium">{activeMap.name}</span>
                    </p>
                    {branch === "breakpoint" ? (
                      <p className="text-sm font-semibold text-white">
                        Final Race Time: <span className="font-mono text-cyan-400">{formatTime(elapsedMs)}</span>
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-white">
                        Max Projection: <span className="font-mono text-cyan-400">{currentPos.x.toFixed(2)}m</span>
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
                      Main Menu
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right side: Sidebar (Leaderboard + Chat) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Live Leaderboard / Distance scoreboard */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-md backdrop-blur-md space-y-4">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Live Rankings</h3>
                
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
                        <span className="font-semibold truncate text-slate-800 dark:text-slate-205">
                          {player.name} {player.isYou && "(You)"}
                        </span>
                      </div>
                      
                      <div className="text-right font-mono font-bold shrink-0">
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

              {/* Chat box (Only rendered in multiplayer mode) */}
              {mode === "multiplayer" && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-md backdrop-blur-md flex flex-col h-[280px]">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3 shrink-0">Lobby Chat</h3>
                  
                  {/* Messages container */}
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                    {chatMessages.length === 0 ? (
                      <p className="text-slate-400 italic text-[11px] text-center pt-8">No messages. Type below to say hi!</p>
                    ) : (
                      chatMessages.map((msg, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <span className="font-semibold text-cyan-600 dark:text-cyan-400">{msg.author}: </span>
                          <span className="text-slate-700 dark:text-slate-300 break-words">{msg.text}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Form input */}
                  <form onSubmit={handleSendChat} className="mt-3 flex gap-2 shrink-0">
                    <input
                      type="text"
                      placeholder="Say hello..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
