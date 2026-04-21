import PortalConfirmedFeature from "@/src/components/features/portal-confirmed";

export default async function PortalConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const status = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : "approved";

  return <PortalConfirmedFeature status={status} />;
}
