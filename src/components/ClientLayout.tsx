"use client";

import { usePathname } from "next/navigation";
import Navbar from "./shop/Navbar";
import Footer from "./shop/Footer";
import CustomCursor from "./shop/CustomCursor";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith("/admin");

    return (
        <>
            <CustomCursor />
            {isAdminPath ? (
                children
            ) : (
                <>
                    <Navbar />
                    {children}
                    <Footer />
                </>
            )}
        </>
    );
}
