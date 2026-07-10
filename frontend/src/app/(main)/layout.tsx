import { AppShell } from "@/components/AppShell";
import { ToastProvider } from "@/components/ui/Toast";

// Without this, Next statically optimizes this route group (nothing here calls a server-side
// dynamic API directly) and its Full Route Cache serves the *same* cached HTML — built from
// whichever session happened to render it first, for up to `s-maxage=31536000` — to every
// subsequent request/user, regardless of who's actually signed in. Only a cache-bypassing hard
// reload ever showed correct content. Force per-request rendering for every page in here.
export const dynamic = "force-dynamic";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AppShell>{children}</AppShell>
    </ToastProvider>
  );
}
