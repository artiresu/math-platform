# Math Hub Platform

The Ultimate University Maths Admissions Hub — a Next.js app for A-Level practice and UK university admissions prep (TMUA, STEP, and more).

## Features

- Dark, responsive UI built with Tailwind CSS
- KaTeX-rendered maths questions with step-by-step hints
- Multi-page navigation:
  - **Home** (`/`) — hero, sample TMUA-style logic question
  - **Exam Prep** (`/exam-prep`) — admissions test practice (starter page)
  - **Math Games** (`/games`) — quick puzzles (starter page)
  - **Leaderboards** (`/leaderboards`) — global rankings (starter page)

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (LTS recommended)
- [Git](https://git-scm.com/)
- npm (included with Node.js)

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/math-platform.git
cd math-platform
```

Replace `YOUR_USERNAME` with the real GitHub org or username.

### 2. Install dependencies

```bash
npm install
```

This runs **`prisma generate`** automatically (`postinstall`) and creates `node_modules/@prisma/client`. Without that step, `npm run build` fails with **Can't resolve '@prisma/client'**.

Do **not** use `npm install --ignore-scripts` unless you know you need to — it skips Prisma client generation.

### 3. Environment variables

```bash
copy .env.example .env
```

On macOS/Linux: `cp .env.example .env`

Use **`.env`** (not only `.env.local`): both Next.js and the Prisma CLI read it. The default `DATABASE_URL` points at a local SQLite file (`prisma/dev.db` after migrate). Auth and leaderboards need this for local testing. Do **not** commit `.env`.

Optional — apply the database schema once:

```bash
npm run db:push
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The dev script is pinned to **port 3000**. If the page is blank, check that nothing else is using that port, or stop old `node` processes and restart.

### 5. Production build (optional)

```bash
npm run build
npm start
```

## Project structure

```
math-platform/
├── app/
│   ├── components/     # Shared UI (NavBar, SafeLatex, PageShell)
│   ├── exam-prep/      # Exam prep route
│   ├── games/          # Math games route
│   ├── leaderboards/   # Leaderboards route
│   ├── layout.tsx      # Root layout & fonts
│   ├── page.tsx        # Homepage
│   └── globals.css
├── public/
├── .vscode/            # Workspace settings (optional)
└── package.json
```

## Scripts

| Command              | Description                                      |
|----------------------|--------------------------------------------------|
| `npm run dev`        | Start dev server on port 3000 (runs `prisma generate` first) |
| `npm run build`      | Create production build (runs `prisma generate` first)       |
| `npm start`          | Run production server                            |
| `npm run lint`       | Run ESLint                                       |
| `npm run db:generate`| Regenerate Prisma client after schema changes      |
| `npm run db:push`    | Push schema to local database                    |
| `npm run db:studio`  | Open Prisma Studio                               |

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [KaTeX](https://katex.org/) for LaTeX rendering
- [Prisma](https://www.prisma.io/) + SQLite/PostgreSQL for users and scores

## Collaborating

1. Ask the repo owner to add you as a **collaborator** on GitHub.
2. Clone the repo and create a branch for your work:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit and push:

   ```bash
   git add .
   git commit -m "Describe your change"
   git push -u origin feature/your-feature-name
   ```

4. Open a **Pull Request** on GitHub for review before merging to `main`.

### Tips

- Never commit `node_modules/`, `.next/`, or `.env` (they are in `.gitignore`).
- Pull latest `main` before starting new work: `git pull origin main`
- After `git pull`, if you see Prisma errors, run `npm install` (or `npm run db:generate`).
- On Windows, this repo includes `.vscode/settings.json` to default the terminal to **Command Prompt** if PowerShell causes npm issues.

### Build fails with `@prisma/client` not found?

1. Run `npm install` from the repo root (not inside a subfolder).
2. Then `npm run db:generate` if needed.
3. Retry `npm run dev` or `npm run build`.

The generated client is **not** committed to git; everyone generates it locally after install.

## Roadmap

- [ ] Full Exam Prep content (TMUA, STEP)
- [ ] Math Games mini-challenges
- [ ] Global leaderboards

## License

Private / educational project — confirm licensing with the repository owner before public distribution.
