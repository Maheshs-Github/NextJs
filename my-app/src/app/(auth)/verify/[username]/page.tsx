import VerifyAccountForm from "./VerifyAccountForm";

export default async function VerifyAccountPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <VerifyAccountForm username={username} />;
}
