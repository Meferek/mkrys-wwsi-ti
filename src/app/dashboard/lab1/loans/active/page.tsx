import Card from "@/components/global/Card";
import Table from "@/components/global/Table";
import LoansTableColumns from "@/components/tables/LoansTableColumns";

export default function Page() {
    return (
        <>
            <Card title="Aktywne wypożyczenia" subtitle="Lista aktywnych wypożyczeń książek"></Card>

            <Table 
                fetchURL="/api/lab1/loans"
                columns={ LoansTableColumns }
            />
        </>
    );
}
