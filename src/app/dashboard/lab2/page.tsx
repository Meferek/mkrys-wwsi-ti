import { Button } from "@mui/material";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex flex-col h-screen justify-center items-center gap-2">
            <Link href="/dashboard/lab2/products">
                <Button className="w-[320px]" variant="outlined" color="primary" endIcon={<ArrowForwardIosOutlinedIcon className="text-xs" />}>
                    Produkty
                </Button>
            </Link>
        </div>
    );
}
