// `page.tsx` in this segment is a client component, and Next's route-segment config exports
// (like `dynamic`) aren't honored inside "use client" files — they need a Server Component,
// hence this thin layout. Without it, Next statically caches this page too (same issue fixed
// for the (main) route group's layout), which is unnecessary risk for anything in the auth flow.
export const dynamic = "force-dynamic";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
