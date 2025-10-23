'use client'

import { Books } from "@prisma/client";
import Card from "../global/Card";
import { useEffect, useState } from "react";
import { fetchDataGET } from "@/lib/fetch/fetchDataGET";
import { Pagination } from "@mui/material";
import Image from "next/image";


const Bookshelf = () => {

    const [books, setBooks] = useState<Books[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
    });

    const fetchBooks = async () => {

        try {

            const response = await fetchDataGET(`/api/books?page=${pagination.page - 1}&pageSize=${pagination.pageSize}`);
            setBooks(response.data);
            setTotalCount(response.totalCount || 0);

        } catch (error) {
            console.error("Error fetching books:", error);
        }

    };

    useEffect(() => {
        fetchBooks();
    }, [pagination]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({ ...prev, page: value }));
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = "/image.png";
    };

    const totalPages = Math.ceil(totalCount / pagination.pageSize);

    return (
        <>
            
            <Card title="Książki" subtitle="Lista książek"></Card>
            <Card className="flex flex-col items-center justify-center mt-4">
                <Pagination 
                    count={ totalPages } 
                    page={ pagination.page }
                    onChange={ handlePageChange }
                    variant="outlined" 
                    className="mb-8"
                />
                <div className="grid grid-cols-6 gap-4">
                    { books.map((book) => (
                        <div key={book.id} className="border border-royal-blue-700/30 p-4 rounded-lg overflow-hidden relative flex flex-col">
                            <div className="w-full h-96 relative mb-2">
                                <Image 
                                    src={ book.imageUrlL || "/image.png" } 
                                    alt={ book.title } 
                                    fill
                                    className="object-cover rounded" 
                                    unoptimized 
                                    onError={handleImageError}
                                />
                            </div>
                            <h3 className="text-lg font-semibold my-2 line-clamp-2">{ book.title }</h3>
                            <p className="text-sm text-gray-600 mb-1">Autor: { book.author }</p>
                        </div>
                    ))}
                </div>
                <Pagination 
                    count={ totalPages } 
                    page={ pagination.page }
                    onChange={ handlePageChange }
                    variant="outlined" 
                    className="mt-8"
                />
            </Card>
        </>
    );
}

export default Bookshelf;