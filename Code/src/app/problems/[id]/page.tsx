import { UniversalProblemWorkspace } from "@/components/problem/UniversalProblemWorkspace";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProblemDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <UniversalProblemWorkspace problemId={resolvedParams.id} />;
}

