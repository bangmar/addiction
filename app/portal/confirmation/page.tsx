import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import PortalConfirmationFeature from "@/src/components/features/portal-confirmation";

export default async function PortalConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = await searchParams;
  const requestId = typeof resolvedSearchParams.requestId === "string" ? resolvedSearchParams.requestId : "";
  const code = typeof resolvedSearchParams.code === "string" ? resolvedSearchParams.code : "";

  if (!session?.user?.email) {
    const callbackUrl = `/portal/confirmation?requestId=${encodeURIComponent(requestId)}&code=${encodeURIComponent(code)}`;
    redirect(`/portal?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return <PortalConfirmationFeature requestId={requestId} code={code} />;
}
