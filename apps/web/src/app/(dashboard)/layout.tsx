import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-wing-100 flex flex-col fixed h-full">
        <div className="p-4 border-b border-wing-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦋</span>
            <span className="font-semibold text-wing-900">WingAI</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavItem href="/pipeline" icon="📊" label="Pipeline" />
          <NavItem href="/analytics" icon="📈" label="Analys" />
          <NavItem href="/import" icon="📷" label="Importera profil" />
          <NavItem href="/settings" icon="⚙️" label="Inställningar" />
        </nav>

        <div className="p-3 border-t border-wing-50">
          <form action="/api/auth/signout" method="POST">
            <button className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-wing-50">
              Logga ut
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56">{children}</main>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-wing-900 hover:bg-wing-50 transition-colors"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
