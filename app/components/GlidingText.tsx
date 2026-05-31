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
  
  // Split the text into words
  const words = text.split(" ");

  // Absolute character index for continuous stagger delays across words
  let absoluteCharIndex = 0;

  return (
    <Component className={`select-none ${className}`}>
      {words.map((word, wordIndex) => {
        const chars = Array.from(word);
        
        return (
          <React.Fragment key={wordIndex}>
            {/* Force the entire word to wrap together as a single block */}
            <span className="inline-block whitespace-nowrap">
              {chars.map((char) => {
                const delay = baseDelay + absoluteCharIndex * staggerDelay;
                absoluteCharIndex++;
                
                return (
                  <span
                    key={absoluteCharIndex}
                    className="animate-letter-glide"
                    style={{
                      animationDelay: `${delay}ms`,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
            
            {/* Standard line break space after each word except the last one */}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </React.Fragment>
        );
      })}
    </Component>
  );
}
