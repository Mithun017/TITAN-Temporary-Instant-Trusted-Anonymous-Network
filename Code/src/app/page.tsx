import { AppShell } from "@/components/shell/AppShell";
import { ProblemCatalog } from "@/components/problem/ProblemCatalog";

export default function HomePage() {
  return (
    <AppShell>
      <ProblemCatalog />
    </AppShell>
  );
}

