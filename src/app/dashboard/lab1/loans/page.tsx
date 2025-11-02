import LoanBookForm from "@/components/forms/LoanBookForm";
import Card from "@/components/global/Card";
import Table from "@/components/global/Table";
import LoansTableColumns from "@/components/tables/LoansTableColumns";

export default function Page() {
    return (
        <>
            <Card title="Wypożyczenia książek" subtitle="Lista wszystkich wypożyczeń"></Card>

            <Table 
                fetchURL="/api/lab1/loans"
                columns={ LoansTableColumns }
            />

            <Card title="Wypożycz książkę" subtitle="Formularz wypożyczenia książki">
                <LoanBookForm />
            </Card>
        </>
    );
}
