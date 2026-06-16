export type BlindspotQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string; // "A", "B", "C", "D" or "E"
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme";
};

// Day 0: Sunday, Day 1: Monday, ..., Day 6: Saturday
export const BLINDSPOT_QUESTIONS: Record<number, BlindspotQuestion[]> = {
  // Sunday (Extreme)
  0: [
    {
      id: "sun-1",
      question: "The Monty Hall Problem: You choose Door 1 out of three doors. Behind one door is a car, and behind the other two are goats. The host Monty (who knows what's behind the doors) opens Door 3, which has a goat. He asks if you want to switch to Door 2. Should you switch?",
      options: [
        "A) No, it doesn't matter since the probability is 1/2 for both doors.",
        "B) Yes, switching increases your probability of winning the car to 2/3.",
        "C) No, switching actually decreases your probability to 1/3.",
        "D) Yes, switching increases your probability of winning to 3/4.",
        "E) No, because Door 1 now has a 2/3 probability of containing the car."
      ],
      correctAnswer: "B",
      explanation: "Initially, your chosen Door 1 has a 1/3 chance. The remaining two doors have a combined 2/3 chance. By opening a goat door among the remaining doors, Monty concentrates the full 2/3 probability onto the other unopened door (Door 2). Switching therefore doubles your chances.",
      difficulty: "Extreme"
    },
    {
      id: "sun-2",
      question: "A rope hangs over a frictionless pulley. A monkey of mass M hangs on one side, and a counterweight of mass M hangs on the other side, balancing perfectly. The monkey begins to climb the rope. What happens to the weight?",
      options: [
        "A) The weight moves downwards.",
        "B) The weight moves upwards at the same rate as the monkey.",
        "C) The weight remains stationary.",
        "D) The weight moves upwards at twice the speed of the monkey.",
        "E) The weight vibrates but remains at its average height."
      ],
      correctAnswer: "B",
      explanation: "As the monkey pulls the rope down to climb, it exerts a downward force on the rope, which increases tension. Since the pulley is frictionless and the tension is uniform, this identical upward force acts on the weight, causing it to rise at the exact same rate as the monkey.",
      difficulty: "Extreme"
    },
    {
      id: "sun-3",
      question: "How many trailing zeros are at the end of the decimal representation of 100! (100 factorial)?",
      options: [
        "A) 20",
        "B) 24",
        "C) 25",
        "D) 10",
        "E) 21"
      ],
      correctAnswer: "B",
      explanation: "Trailing zeros are produced by factors of 10, which are pairs of 2 and 5 in the prime factorization of 100!. Since 5 is less frequent than 2, we calculate the number of factors of 5 using Legendre's Formula: floor(100/5) + floor(100/25) = 20 + 4 = 24.",
      difficulty: "Extreme"
    }
  ],
  // Monday (Easy)
  1: [
    {
      id: "mon-1",
      question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
      options: [
        "A) $0.10",
        "B) $0.05",
        "C) $0.15",
        "D) $0.20",
        "E) $0.01"
      ],
      correctAnswer: "B",
      explanation: "If the ball costs x, the bat costs x + $1.00. Together, x + (x + 1.00) = 1.10 => 2x = 0.10 => x = 0.05 ($0.05).",
      difficulty: "Easy"
    },
    {
      id: "mon-2",
      question: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
      options: [
        "A) 100 minutes",
        "B) 5 minutes",
        "C) 20 minutes",
        "D) 25 minutes",
        "E) 50 minutes"
      ],
      correctAnswer: "B",
      explanation: "If 5 machines make 5 widgets in 5 minutes, it means 1 machine makes 1 widget in 5 minutes. Therefore, if 100 machines work in parallel, they will take 5 minutes to make 100 widgets.",
      difficulty: "Easy"
    },
    {
      id: "mon-3",
      question: "In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take to cover half the lake?",
      options: [
        "A) 24 days",
        "B) 47 days",
        "C) 12 days",
        "D) 36 days",
        "E) 46 days"
      ],
      correctAnswer: "B",
      explanation: "Since the patch doubles in size every day, if it covers the entire lake on day 48, it must have covered exactly half of the lake on day 47.",
      difficulty: "Easy"
    }
  ],
  // Tuesday (Easy-Medium)
  2: [
    {
      id: "tue-1",
      question: "If you spin a fair coin 5 times and get Heads each time, what is the probability that the next spin is Tails?",
      options: [
        "A) 1/2",
        "B) 1/64",
        "C) 1/32",
        "D) 31/32",
        "E) 1/6"
      ],
      correctAnswer: "A",
      explanation: "A coin has no memory; each flip is independent. The probability of Tails remains exactly 1/2.",
      difficulty: "Easy"
    },
    {
      id: "tue-2",
      question: "A car travels at 30 mph from point A to point B, and returns from B to A at 60 mph. What is the average speed of the round trip?",
      options: [
        "A) 45 mph",
        "B) 40 mph",
        "C) 50 mph",
        "D) 36 mph",
        "E) 42 mph"
      ],
      correctAnswer: "B",
      explanation: "Let the distance from A to B be d. The time to travel to B is d/30, and the time to return is d/60. Total distance is 2d, and total time is d/30 + d/60 = d/20. Average speed = 2d / (d/20) = 40 mph.",
      difficulty: "Medium"
    },
    {
      id: "tue-3",
      question: "How many cuts are needed to cut a single log of wood into 10 pieces?",
      options: [
        "A) 10",
        "B) 9",
        "C) 5",
        "D) 11",
        "E) 8"
      ],
      correctAnswer: "B",
      explanation: "Each cut increases the total number of wood pieces by 1. Since you start with 1 piece, you need exactly 9 cuts to obtain 10 pieces.",
      difficulty: "Easy"
    }
  ],
  // Wednesday (Medium)
  3: [
    {
      id: "wed-1",
      question: "A shopkeeper sells an item for $100, making a 25% profit relative to the cost price. What was the cost price of the item?",
      options: [
        "A) $75",
        "B) $80",
        "C) $125",
        "D) $85",
        "E) $90"
      ],
      correctAnswer: "B",
      explanation: "Selling Price = Cost Price * 1.25. Therefore, Cost Price = $100 / 1.25 = $80.",
      difficulty: "Medium"
    },
    {
      id: "wed-2",
      question: "In a room containing 30 people, what is the approximate probability that at least two people share the same birthday (day and month)?",
      options: [
        "A) Less than 5%",
        "B) About 10%",
        "C) About 50%",
        "D) More than 70%",
        "E) Exactly 100%"
      ],
      correctAnswer: "D",
      explanation: "By the Birthday Paradox, the probability that at least two people share a birthday in a group of 30 is approximately 70.6%.",
      difficulty: "Medium"
    },
    {
      id: "wed-3",
      question: "Box A has 2 gold coins, Box B has 2 silver coins, and Box C has 1 gold and 1 silver coin. You choose a box at random and draw a coin. It is gold. What is the probability that the other coin in that box is also gold?",
      options: [
        "A) 1/2",
        "B) 2/3",
        "C) 1/3",
        "D) 3/4",
        "E) 1/4"
      ],
      correctAnswer: "B",
      explanation: "This is Bertrand's Box Paradox. There are 3 possible gold coins you could have drawn: Gold 1 (Box A), Gold 2 (Box A), or Gold 3 (Box C). In 2 of these 3 equally likely cases, the other coin is gold. Thus, the probability is 2/3.",
      difficulty: "Medium"
    }
  ],
  // Thursday (Medium-Hard)
  4: [
    {
      id: "thu-1",
      question: "A rope is tied tightly around the equator of the Earth (assumed to be a perfect sphere). You add 10 meters to the rope's length and raise it uniformly above the ground. Can a cat crawl under it?",
      options: [
        "A) No, it raises by less than a millimeter.",
        "B) Yes, it raises by about 1.6 meters.",
        "C) No, it raises by about 1.6 micrometers.",
        "D) Yes, it raises by about 10 centimeters.",
        "E) No, it raises by 1.6 nanometers."
      ],
      correctAnswer: "B",
      explanation: "Let the Earth's radius be R. The original rope length is 2*pi*R. The new radius R' satisfies 2*pi*R' = 2*pi*R + 10 => R' - R = 10 / (2*pi) ≈ 1.59 meters. A cat can easily walk under a rope raised 1.6m high.",
      difficulty: "Hard"
    },
    {
      id: "thu-2",
      question: "Which of the following real numbers is larger: e^pi or pi^e?",
      options: [
        "A) e^pi",
        "B) pi^e",
        "C) They are exactly equal.",
        "D) It depends on the logarithmic base.",
        "E) Neither, they are purely imaginary."
      ],
      correctAnswer: "A",
      explanation: "Since the function f(x) = x^(1/x) achieves its global maximum at x = e, we have e^(1/e) > pi^(1/pi). Raising both sides to the power e*pi yields e^pi > pi^e.",
      difficulty: "Hard"
    },
    {
      id: "thu-3",
      question: "If a clock takes 5 seconds to strike 6 o'clock, how long will it take to strike 12 o'clock?",
      options: [
        "A) 10 seconds",
        "B) 11 seconds",
        "C) 12 seconds",
        "D) 9 seconds",
        "E) 13 seconds"
      ],
      correctAnswer: "B",
      explanation: "Striking 6 times requires 5 intervals between strikes. If 5 intervals take 5 seconds, each interval is 1 second. Striking 12 times requires 11 intervals, which takes exactly 11 seconds.",
      difficulty: "Medium"
    }
  ],
  // Friday (Hard)
  5: [
    {
      id: "fri-1",
      question: "A beaker is filled with a colony of bacteria that double in number every minute. If the beaker is completely full after 1 hour, at what minute was the beaker exactly 12.5% full?",
      options: [
        "A) 7.5 minutes",
        "B) 57 minutes",
        "C) 45 minutes",
        "D) 15 minutes",
        "E) 58 minutes"
      ],
      correctAnswer: "B",
      explanation: "Working backwards: full (100%) at 60 mins. Half full (50%) at 59 mins. Quarter full (25%) at 58 mins. One-eighth full (12.5%) at 57 mins.",
      difficulty: "Medium"
    },
    {
      id: "fri-2",
      question: "You roll a 6-sided die. If you get a 6, you win $10. If not, you can roll again once. On the second roll, you win $10 if you roll a 6, and nothing otherwise. What is the expected value of this game if you follow the optimal strategy?",
      options: [
        "A) $1.67",
        "B) $2.50",
        "C) $2.78",
        "D) $3.06",
        "E) $1.94"
      ],
      correctAnswer: "D",
      explanation: "If you roll a 6 on roll 1 (prob 1/6), you stop and take $10. If you roll 1-5 (prob 5/6), you roll again. The expected value of roll 2 is 1/6 * 10 = $5/3. Expected value = 1/6 * 10 + 5/6 * (5/3) = 10/6 + 25/18 = 55/18 ≈ $3.06.",
      difficulty: "Hard"
    },
    {
      id: "fri-3",
      question: "Two cyclists start 20 miles apart and cycle towards each other at 10 mph each. A fly starts at one cyclist and flies back and forth between them at 15 mph until they meet. How far does the fly travel?",
      options: [
        "A) 15 miles",
        "B) 20 miles",
        "C) 30 miles",
        "D) 25 miles",
        "E) 10 miles"
      ],
      correctAnswer: "A",
      explanation: "The relative speed of the cyclists is 10 + 10 = 20 mph. They meet in exactly 20 miles / 20 mph = 1 hour. Since the fly travels continuously at 15 mph, it covers exactly 15 miles in 1 hour.",
      difficulty: "Medium"
    }
  ],
  // Saturday (Very Hard)
  6: [
    {
      id: "sat-1",
      question: "A drawer contains 10 red socks and 10 blue socks. What is the minimum number of socks you must pull out in the dark to guarantee that you have at least one matching pair?",
      options: [
        "A) 3",
        "B) 11",
        "C) 2",
        "D) 4",
        "E) 20"
      ],
      correctAnswer: "A",
      explanation: "By the Pigeonhole Principle, since there are only 2 distinct categories (red and blue), pulling 3 socks guarantees that at least 2 of them must belong to the same category.",
      difficulty: "Easy"
    },
    {
      id: "sat-2",
      question: "What is the sum of the infinite alternating series: 1 - 1 + 1 - 1 + 1 - 1 + ... ?",
      options: [
        "A) 0",
        "B) 1",
        "C) 1/2",
        "D) Undefined (the series diverges)",
        "E) Infinity"
      ],
      correctAnswer: "D",
      explanation: "The sequence of partial sums alternates between 1 and 0. Since the sequence of partial sums does not converge to a single real number, the series diverges by definition and has no standard sum.",
      difficulty: "Hard"
    },
    {
      id: "sat-3",
      question: "An urn contains 4 red balls and 6 blue balls. If you draw two balls at random without replacement, what is the probability that they have different colors?",
      options: [
        "A) 8/15",
        "B) 24/25",
        "C) 1/2",
        "D) 7/15",
        "E) 12/25"
      ],
      correctAnswer: "A",
      explanation: "Probability of Red then Blue is (4/10) * (6/9) = 24/90. Probability of Blue then Red is (6/10) * (4/9) = 24/90. Total probability of different colors = 24/90 + 24/90 = 48/90 = 8/15.",
      difficulty: "Hard"
    }
  ]
};
