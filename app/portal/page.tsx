import { Suspense } from "react";

import PortalFeature from "@/src/components/features/portal";

export default function PortalPage() {
  const oauthEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );

  return (
    <Suspense fallback={null}>
      <PortalFeature oauthEnabled={oauthEnabled} />
    </Suspense>
  );
}
