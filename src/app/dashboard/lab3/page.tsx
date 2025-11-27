import { Button } from "@mui/material";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex flex-col h-screen justify-center items-center gap-2">
            <Link href="/dashboard/lab3/posts">
                <Button className="w-[320px]" variant="outlined" color="primary" endIcon={<ArrowForwardIosOutlinedIcon className="text-xs" />}>
                    Posty
                </Button>
            </Link>
            <Link href="/dashboard/lab3/moderation">
                <Button className="w-[320px]" variant="outlined" color="primary" endIcon={<ArrowForwardIosOutlinedIcon className="text-xs" />}>
                    Moderacja komentarzy
                </Button>
            </Link>
        </div>
    );
}
