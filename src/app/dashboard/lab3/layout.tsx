import NavbarLab3 from "@/components/global/NavbarLab3";
import { TableDataProvider } from "@/contexts/TableDataContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "MKRYS - WWSI TI - Lab 3",
    description: "Blog z komentarzami i moderacją - Mateusz Krysiak",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <TableDataProvider>
            <div className="flex w-screen h-screen bg-royal-blue-50/50 gap-4">
                
                <NavbarLab3 />

                <div className="flex flex-col gap-4 flex-1 my-4 mr-4 rounded-2xl overflow-auto scrollbar-hide">
                    { children }
                </div>

            </div>
        </TableDataProvider>
    );
}
