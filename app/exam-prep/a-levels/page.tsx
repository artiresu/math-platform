import { BranchSelector } from "../../components/BranchSelector";
import { PageShell } from "../../components/PageShell";

export default function ALevelsHubPage() {
  return (
    <PageShell>
      <BranchSelector
        title="A-Levels"
        description="Select a subject to open its practice room with exam boards, curriculum modules, and examination archives."
        branches={[
          {
            href: "/exam-prep/a-levels/maths",
            title: "Mathematics",
            description:
              "Pure mathematics, mechanics, and statistics across Year 1 and Year 2.",
          },
          {
            href: "/exam-prep/a-levels/further-maths",
            title: "Further Mathematics",
            description:
              "Advanced pure, further mechanics, and further statistics modules.",
          },
          {
            href: "/exam-prep/a-levels/computer-science",
            title: "Computer Science",
            description:
              "Programming, algorithms, and theory — content library expanding soon.",
          },
        ]}
      />
    </PageShell>
  );
}
