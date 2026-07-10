"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

/** Refetch session when the tab is restored from the browser back/forward cache. */
export function SessionRecovery() {
  const { update } = useSession();

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        void update();
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [update]);

  return null;
}
