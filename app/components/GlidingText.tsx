"use client";

import React from "react";

type GlidingTextProps = {
  text: string;
  className?: string;
  element?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  baseDelay?: number; // base delay in ms
  staggerDelay?: number; // stagger delay per letter in ms
};

export function GlidingText({
  text,
  className = "",
  element = "h1",
  baseDelay = 0,
  staggerDelay = 18,
}: GlidingTextProps) {
  const Component = element;
  
  // Split the text into individual characters
  const chars = Array.from(text);

  return (
    <Component className={`inline-block select-none ${className}`}>
      {chars.map((char, index) => {
        const delay = baseDelay + index * staggerDelay;
        return (
          <span
            key={index}
            className="animate-letter-glide"
            style={{
              animationDelay: `${delay}ms`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </Component>
  );
}
