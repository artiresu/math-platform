import { BranchSelector } from "../components/BranchSelector";
import { PageShell } from "../components/PageShell";

export default function InterviewPrepHubPage() {
  return (
    <PageShell>
      <BranchSelector
        title="Interview Prep"
        description="Choose your interview track. Each branch has tailored prompts, hints, and guidance for how interviewers expect you to think out loud."
        branches={[
          {
            href: "/interview-prep/quant-finance",
            title: "Quantitative Finance & Data Analysis",
            description:
              "Probability, statistics, market intuition, and data-driven reasoning for quant and finance interviews.",
            badge: "Finance & data",
          },
          {
            href: "/interview-prep/oxbridge",
            title: "Oxbridge Interviews",
            description:
              "Classic mathematical problem-solving and whiteboard-style prompts for Oxford, Cambridge, and top UK maths interviews.",
            badge: "Oxbridge",
          },
        ]}
      />
    </PageShell>
  );
}
