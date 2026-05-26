import { SidebarNav } from "./sidebar-nav";

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-background md:block">
      <div className="sticky top-0 flex h-screen flex-col p-4">
        <h2 className="mb-8 px-3 text-xl font-bold tracking-tight">
          SmartLedger
        </h2>
        <SidebarNav />
      </div>
    </aside>
  );
}
