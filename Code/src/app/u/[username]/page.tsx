import { UserProfileView } from "@/components/profile/UserProfileView";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const resolved = await params;
  return <UserProfileView usernameParam={resolved.username} />;
}

