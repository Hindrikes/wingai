import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

function WingLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="9" fill="#C4532A" />
      <path
        d="M10 36 C10 24, 20 10, 34 9 C24 15, 17 24, 22 33 C26 22, 34 14, 46 10 C38 20, 32 30, 37 42 C30 38, 20 40, 10 36Z"
        fill="white"
        opacity="0.95"
      />
    </svg>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-sand-200 flex">
      {/* Sidebar */}
      <aside className="w-16 bg-ink-900 flex flex-col items-center fixed h-full py-5 gap-1">
        <div className="mb-6">
          <WingLogo size={36} />
        </div>

        <NavIcon href="/pipeline" icon="⊞" label="Pipeline" />
        <NavIcon href="/analytics" icon="📈" label="Analys" />
        <NavIcon href="/import" icon="⬆️" label="Importera" />

        <div className="mt-auto">
          <NavIcon href="/settings" icon="⚙️" label="Inställningar" />
          <form action="/api/auth/signout" method="POST" className="mt-1">
            <button
              title="Logga ut"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-ink-500 hover:text-sand-300 hover:bg-white/8 transition-colors text-base"
            >
              ↩
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-16 bg-sand-100 min-h-screen">{children}</main>
    </div>
  );
}

function NavIcon({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      title={label}
      className="w-10 h-10 rounded-lg flex items-center justify-center text-ink-500 hover:text-sand-200 hover:bg-white/8 transition-colors text-base"
    >
      {icon}
    </Link>
  );
}
