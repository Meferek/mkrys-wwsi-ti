import Link from "next/link";
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import { Button } from "@mui/material";

const links = [
    { href: "/dashboard", label: "Główna", icon: <HomeOutlinedIcon /> },
    { href: "/dashboard/books", label: "Książki", icon: <BookOutlinedIcon /> },
    { href: "/dashboard/members", label: "Członkowie", icon: <GroupOutlinedIcon /> },
    { href: "/dashboard/loans", label: "Wypożyczenia", icon: <ImportContactsOutlinedIcon /> },
]

const Navbar = () => {
    return (
        <div className="flex flex-col flex-none w-[300px] rounded-2xl my-4 ml-4 p-4 border-1 border-royal-blue-700/30 overflow-hidden gap-3 bg-white">
                
            { links.map(({ href, label, icon }) => (
                <Link key={ href } href={ href } className="w-full">
                    <Button fullWidth className="flex items-start justify-start place-items-start py-2" variant="outlined">
                        { icon }
                        <span className="ml-2">{ label }</span>
                    </Button>
                </Link>
            ))}

        </div>
    );
}

export default Navbar;