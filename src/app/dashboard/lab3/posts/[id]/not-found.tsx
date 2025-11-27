import Card from "@/components/global/Card";
import { Alert, Button } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
    return (
        <Card title="Nie znaleziono">
            <Alert severity="error" sx={{ mb: 2 }}>
                Post o podanym ID nie istnieje.
            </Alert>
            <Link href="/dashboard/lab3/posts">
                <Button variant="contained">
                    Wróć do listy postów
                </Button>
            </Link>
        </Card>
    );
}
