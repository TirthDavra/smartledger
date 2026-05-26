import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/Sidebar";
import SiteFooter from "@/components/layout/site-footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 sm:p-6">{children}</main>

        <SiteFooter />
      </div>
    </div>
  );
}
