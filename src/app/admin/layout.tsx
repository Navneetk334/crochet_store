import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";
import DemoBanner from "@/components/DemoBanner";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-pebble/30 flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-[60]">
                <DemoBanner />
            </div>
            <div className="flex pt-8"> {/* pt-8 to account for banner height */}
                <AdminSidebar />
                <div className="flex-1 flex flex-col transition-all duration-300 admin-content">
                    <AdminHeader />
                    <main className="p-8 admin-main-height">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
