import { Suspense } from "react";

import PortalCallbackFeature from "@/src/components/features/portal-callback";

export default function PortalCallbackPage() {
  return (
    <Suspense fallback={null}>
      <PortalCallbackFeature />
    </Suspense>
  );
}
