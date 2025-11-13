import Link from "next/link";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Button } from "@mui/material";

const links = [
    { href: "/dashboard/lab2", label: "Główna", icon: <HomeOutlinedIcon /> },
    { href: "/dashboard/lab2/products", label: "Produkty", icon: <ShoppingCartOutlinedIcon /> },
]

const NavbarLab2 = () => {
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

export default NavbarLab2;