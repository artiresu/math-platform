import { PAST_PAPERS_FILES } from "./past-papers-data";

export interface PastPaper {
  filename: string;
  board: "edexcel" | "aqa" | "ocra" | "ocrb";
  course: "maths" | "further";
  year: string;
  type: "QP" | "MS" | "Other";
  name: string;
  level: "A-Level" | "AS-Level" | "Other";
}

export function parsePastPapers(): PastPaper[] {
  return PAST_PAPERS_FILES.map((filename): PastPaper => {
    const parts = filename.split("_");
    
    // Default values
    let board: "edexcel" | "aqa" | "ocra" | "ocrb" = "edexcel";
    let course: "maths" | "further" = "maths";
    let year = "Unknown";
    let type: "QP" | "MS" | "Other" = "Other";
    let name = filename.replace(".pdf", "");
    let level: "A-Level" | "AS-Level" | "Other" = "A-Level";

    if (parts.length >= 3) {
      const rawBoard = parts[0].toLowerCase();
      
      // 1. Detect Board and Year Index
      let yearIdx = 1;
      if (rawBoard === "edexcel") {
        board = "edexcel";
        yearIdx = 1;
      } else if (rawBoard === "aqa") {
        board = "aqa";
        yearIdx = 1;
      } else if (rawBoard === "ocr") {
        const ocrType = parts[1].toLowerCase();
        if (ocrType === "a") board = "ocra";
        else board = "ocrb";
        yearIdx = 2;
      }

      // 2. Parse Year
      year = parts[yearIdx] || "Unknown";

      // 3. Parse Document Type (handling trailing counters e.g. QP_1.pdf or MS_2.pdf)
      let endIdx = parts.length - 1;
      let lastPart = parts[endIdx].replace(".pdf", "");
      
      if (/^\d+$/.test(lastPart)) {
        endIdx = parts.length - 2;
        lastPart = parts[endIdx];
      }

      if (lastPart.toUpperCase() === "MS") {
        type = "MS";
      } else if (lastPart.toUpperCase() === "QP") {
        type = "QP";
      }

      // 4. Parse Paper Name
      const nameParts = parts.slice(yearIdx + 1, endIdx);
      const cleanPaperName = nameParts.join(" ");
      name = cleanPaperName;

      // 5. Detect Course Type
      const nameLower = cleanPaperName.toLowerCase();
      if (
        nameLower.includes("further") ||
        nameLower.includes("core pure") ||
        nameLower.includes("decision") ||
        nameLower.includes("hyperbolic") ||
        nameLower.includes("polar") ||
        nameLower.includes("numerical methods") ||
        nameLower.includes("modelling with algorithms") ||
        nameLower.includes("additional pure") ||
        nameLower.includes("discrete mathematics") ||
        nameLower.includes("extra pure") ||
        nameLower.includes("technology") ||
        nameLower.includes("modelling and algorithms")
      ) {
        course = "further";
      } else {
        course = "maths";
      }

      // 6. Detect Level
      if (nameLower.includes("as ") || nameLower.startsWith("as ") || nameLower.includes("as-level")) {
        level = "AS-Level";
      } else {
        level = "A-Level";
      }
    }

    return {
      filename,
      board,
      course,
      year,
      type,
      name,
      level,
    };
  });
}
