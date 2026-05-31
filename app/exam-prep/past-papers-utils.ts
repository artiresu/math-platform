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
    let board: "edexcel" | "aqa" | "ocra" | "ocrb" = "edexcel";
    let course: "maths" | "further" = "maths";
    let year = "Unknown";
    let type: "QP" | "MS" | "Other" = "Other";
    let name = filename;
    let level: "A-Level" | "AS-Level" | "Other" = "A-Level";

    const lower = filename.toLowerCase();

    // 0. Detect and Parse Renamed Edexcel Format
    if (lower.startsWith("edexcel_")) {
      board = "edexcel";
      const parts = filename.split("_");
      year = parts[1] || "Unknown";
      
      const lastPart = parts[parts.length - 1].replace(".pdf", "");
      if (lastPart === "MS") type = "MS";
      else if (lastPart === "QP") type = "QP";
      else type = "Other";
      
      const nameParts = parts.slice(2, parts.length - 1);
      const cleanPaperName = nameParts.join(" ");
      name = cleanPaperName;
      
      const nameLower = cleanPaperName.toLowerCase();
      if (
        nameLower.includes("further") ||
        nameLower.includes("core pure") ||
        nameLower.includes("decision") ||
        nameLower.includes("hyperbolic") ||
        nameLower.includes("polar") ||
        nameLower.includes("numerical methods")
      ) {
        course = "further";
      } else {
        course = "maths";
      }
      
      if (nameLower.includes("as ") || nameLower.startsWith("as ")) {
        level = "AS-Level";
      } else {
        level = "A-Level";
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
    }

    // 1. Detect Board

    // 2. Detect Course (Maths vs Further) and Level (A-Level vs AS-Level)
    if (board === "aqa") {
      // 7357 = A-Level Maths, 7356 = AS Maths
      // 7367 = A-Level Further, 7366 = AS Further
      if (lower.includes("7367")) {
        course = "further";
        level = "A-Level";
      } else if (lower.includes("7366")) {
        course = "further";
        level = "AS-Level";
      } else if (lower.includes("7357")) {
        course = "maths";
        level = "A-Level";
      } else if (lower.includes("7356")) {
        course = "maths";
        level = "AS-Level";
      }
    } else if (board === "edexcel") {
      if (lower.includes("9fm0") || lower.startsWith("eamf") || lower.startsWith("easmf")) {
        course = "further";
        level = "A-Level";
      } else if (lower.includes("8fm0")) {
        course = "further";
        level = "AS-Level";
      } else if (lower.includes("9ma0") || lower.startsWith("eam")) {
        course = "maths";
        level = "A-Level";
      } else if (lower.includes("8ma0") || lower.startsWith("easm")) {
        course = "maths";
        level = "AS-Level";
      }
    } else {
      // OCR A or OCR B
      // Further Maths modules in OCR: "core pure", "additional pure", "modelling with algorithms", "numerical methods", "discrete", "extra pure", "technology", "mechanics major", "mechanics minor", "statistics major", "statistics minor"
      if (
        lower.includes("core pure") ||
        lower.includes("additional pure") ||
        lower.includes("modelling with algorithms") ||
        lower.includes("numerical methods") ||
        lower.includes("discrete mathematics") ||
        lower.includes("extra pure") ||
        lower.includes("technology") ||
        lower.includes("mechanics major") ||
        lower.includes("mechanics minor") ||
        lower.includes("statistics major") ||
        lower.includes("statistics minor") ||
        lower.includes("modelling and algorithms")
      ) {
        course = "further";
      } else {
        course = "maths";
      }
      
      // Level detection for OCR
      if (lower.includes("as-level") || lower.includes("as level")) {
        level = "AS-Level";
      } else {
        level = "A-Level"; // default to A-level as the primary source was 1_A_LEVELS
      }
    }

    // 3. Detect Document Type (QP vs MS)
    if (
      lower.includes("-ms-") ||
      lower.includes("_ms.") ||
      lower.includes(" mark scheme") ||
      lower.includes("_msc_") ||
      lower.includes("_rms_") ||
      lower.includes("_mcs_") ||
      lower.includes("-rms-") ||
      lower.includes("-ms.") ||
      lower.endsWith("ms.pdf")
    ) {
      type = "MS";
    } else if (
      lower.includes("-qp-") ||
      lower.includes("_qp.") ||
      lower.includes("question paper") ||
      lower.includes("_que_") ||
      lower.includes("-qp.") ||
      lower.includes("-que-")
    ) {
      type = "QP";
    } else {
      type = "Other";
    }

    // 4. Detect Year
    // Look for 4 digit years
    const yearMatch = filename.match(/\b(201\d|202\d)\b/);
    if (yearMatch) {
      year = yearMatch[1];
    } else if (lower.includes("sam") || lower.includes("specimen")) {
      year = "SAM";
    } else if (lower.includes("unknown year")) {
      year = "Other";
    } else {
      // Fallbacks
      if (lower.includes("jun18")) year = "2018";
      else if (lower.includes("jun19")) year = "2019";
      else if (lower.includes("nov20") || lower.includes("oct20")) year = "2020";
      else if (lower.includes("nov21") || lower.includes("oct21")) year = "2021";
      else if (lower.includes("jun22")) year = "2022";
      else if (lower.includes("jun23")) year = "2023";
      else if (lower.includes("jun24")) year = "2024";
      else year = "Other";
    }

    // 5. Build Clean Display Name
    let cleanName = filename.replace(".pdf", "");
    
    // Remove prefixes and clean up
    if (cleanName.startsWith("SAM - ")) {
      cleanName = cleanName.substring(6);
    }
    
    // Simplify common styles
    cleanName = cleanName
      .replace(/ocr a - /gi, "")
      .replace(/ocr b \(mei\) - /gi, "")
      .replace(/aqa - /gi, "")
      .replace(/unknown year - /gi, "")
      .replace(/ - question paper/gi, "")
      .replace(/ - mark scheme/gi, "")
      .replace(/_que_\d+/g, "")
      .replace(/_rms_\d+/g, "")
      .replace(/_msc_\d+/g, "")
      .replace(/_que/g, "")
      .replace(/_rms/g, "")
      .replace(/_msc/g, "")
      .replace(/9ma0_01/gi, "Paper 1 (Pure)")
      .replace(/9ma0_02/gi, "Paper 2 (Pure)")
      .replace(/9ma0_03/gi, "Paper 3 (Stats/Mech)")
      .replace(/9ma0_31/gi, "Paper 3 (Statistics)")
      .replace(/9ma0_32/gi, "Paper 3 (Mechanics)")
      .replace(/9ma0-01/gi, "Paper 1 (Pure)")
      .replace(/9ma0-02/gi, "Paper 2 (Pure)")
      .replace(/9ma0-31/gi, "Paper 3 (Statistics)")
      .replace(/9ma0-32/gi, "Paper 3 (Mechanics)")
      .replace(/8ma0_01/gi, "AS Paper 1 (Pure)")
      .replace(/8ma0_21/gi, "AS Paper 21 (Statistics)")
      .replace(/8ma0_22/gi, "AS Paper 22 (Mechanics)")
      .replace(/8ma0-01/gi, "AS Paper 1 (Pure)")
      .replace(/8ma0-21/gi, "AS Paper 2 (Stats)")
      .replace(/8ma0-22/gi, "AS Paper 2 (Mech)")
      .replace(/9fm0-01/gi, "Further Paper 1 (Core Pure)")
      .replace(/9fm0-02/gi, "Further Paper 2 (Core Pure)")
      .replace(/9fm0-3a/gi, "Further Option 3A (Pure)")
      .replace(/9fm0-3b/gi, "Further Option 3B (Algorithms)")
      .replace(/9fm0-3c/gi, "Further Option 3C (Mechanics)")
      .replace(/9fm0-3d/gi, "Further Option 3D (Statistics)")
      .replace(/9fm0-4a/gi, "Further Option 4A (Pure)")
      .replace(/9fm0-4b/gi, "Further Option 4B (Algorithms)")
      .replace(/9fm0-4c/gi, "Further Option 4C (Mechanics)")
      .replace(/9fm0-4d/gi, "Further Option 4D (Statistics)")
      .replace(/9fm0_01/gi, "Further Paper 1 (Core Pure)")
      .replace(/9fm0_02/gi, "Further Paper 2 (Core Pure)")
      .replace(/9fm0_3a/gi, "Further Option 3A (Pure)")
      .replace(/9fm0_3b/gi, "Further Option 3B (Algorithms)")
      .replace(/9fm0_3c/gi, "Further Option 3C (Mechanics)")
      .replace(/9fm0_3d/gi, "Further Option 3D (Statistics)")
      .replace(/9fm0_4a/gi, "Further Option 4A (Pure)")
      .replace(/9fm0_4b/gi, "Further Option 4B (Algorithms)")
      .replace(/9fm0_4c/gi, "Further Option 4C (Mechanics)")
      .replace(/9fm0_4d/gi, "Further Option 4D (Statistics)")
      .replace(/8fm0_01/gi, "AS Further Paper 1")
      .replace(/8fm0_21/gi, "AS Further Paper 21")
      .replace(/8fm0_22/gi, "AS Further Paper 22")
      .replace(/8fm0_23/gi, "AS Further Paper 23")
      .replace(/8fm0_24/gi, "AS Further Paper 24")
      .replace(/8fm0_25/gi, "AS Further Paper 25")
      .replace(/8fm0-01/gi, "AS Further Paper 1")
      .replace(/8fm0-21/gi, "AS Further Paper 21")
      .replace(/8fm0-22/gi, "AS Further Paper 22")
      .replace(/8fm0-23/gi, "AS Further Paper 23")
      .replace(/8fm0-24/gi, "AS Further Paper 24")
      .replace(/8fm0-25/gi, "AS Further Paper 25")
      .replace(/8fm0-26/gi, "AS Further Paper 26")
      .replace(/8fm0-27/gi, "AS Further Paper 27")
      .replace(/8fm0-28/gi, "AS Further Paper 28")
      .replace(/eam\d+/gi, "A-Level ")
      .replace(/easm\d+/gi, "AS-Level ")
      .replace(/eamf\d+/gi, "Further A-Level ")
      .replace(/easmf\d+/gi, "Further AS-Level ")
      .replace(/-/g, " ")
      .trim();

    // Capitalize words beautifully
    cleanName = cleanName
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.substring(1) : ""))
      .join(" ");

    name = cleanName;

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
