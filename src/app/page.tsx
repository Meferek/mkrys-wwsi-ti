import { Button } from "@mui/material";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex h-screen justify-center items-center text-9xl font-bold">
            <Link href="/dashboard/lab1">
                <Button className="w-[320px]" variant="outlined" color="primary" endIcon={<ArrowForwardIosOutlinedIcon className="text-xs" />}>
                    Przejdź do LAB1
                </Button>
            </Link>
        </div>
    );
}
