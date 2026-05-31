import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_USERS = [
  { email: "alex@example.com", name: "Alex Chen" },
  { email: "sam@example.com", name: "Sam Patel" },
  { email: "jordan@example.com", name: "Jordan Lee" },
  { email: "riley@example.com", name: "Riley Morgan" },
];

const SAMPLE_SCORES = [
  { gameType: "speed-arithmetic", scores: [420, 380, 310, 290] },
  { gameType: "integrals", scores: [95, 88, 72] },
  { gameType: "olympiad", scores: [110, 90, 85, 70] },
];

async function main() {
  for (const u of SAMPLE_USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      create: { email: u.email, name: u.name },
      update: { name: u.name },
    });
  }

  const users = await prisma.user.findMany({
    where: { email: { in: SAMPLE_USERS.map((u) => u.email) } },
  });

  await prisma.score.deleteMany({
    where: { user: { email: { in: SAMPLE_USERS.map((u) => u.email) } } },
  });

  for (const { gameType, scores } of SAMPLE_SCORES) {
    for (let i = 0; i < scores.length; i++) {
      const user = users[i % users.length];
      const daysAgo = i * 12 + (gameType === "speed-arithmetic" ? i * 3 : i * 7);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      await prisma.score.create({
        data: {
          userId: user.id,
          gameType,
          score: scores[i],
          createdAt,
        },
      });
    }
  }

  console.log("Seeded sample users and leaderboard scores.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
