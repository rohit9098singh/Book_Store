"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookDetails } from "@/lib/types/type";
import { useGetAllProductsQuery } from "@/store/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NewBook = () => {
    const [currentBookSlide, setCurrentBookSlide] = useState(0);
    const { data: apiResponse = {}, isLoading } = useGetAllProductsQuery({});

    const [books, setBooks] = useState<BookDetails[]>([])

    useEffect(() => {
        if (apiResponse.success) {
            setBooks(apiResponse.data)
        }
    }, [apiResponse])

    const booksPerSlide = 3;
    const totalSlides = Math.ceil(books.length / booksPerSlide);
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBookSlide((prev) => (prev + 1) % totalSlides);
        }, 5000)
        return () => clearInterval(timer);
    }, [totalSlides])

    const previousSlide = () => {
        setCurrentBookSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    }
    const nextSlide = () => {
        setCurrentBookSlide((prev) => (prev + 1) % totalSlides)
    }

    const calculateDiscount = (price: number, finalPrice: number): number => {
        return price > finalPrice && price > 0
            ? Math.round(((price - finalPrice) / price) * 100)
            : 0;
    };

    return (
        <div className="py-16 bg-indigo-100 relative">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Newly Added Books</h2>
                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentBookSlide * 100}%)` }}
                    >
                        {[...Array(totalSlides)].map((_, slideIndex) => (
                            <div className="flex-none w-full" key={slideIndex}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {books.slice(slideIndex * booksPerSlide, (slideIndex + 1) * booksPerSlide).map((book) => (
                                        <Card
                                            key={book._id}
                                            className="shadow-lg   rounded-xl overflow-hidden transition-transform transform hover:scale-105 duration-300 bg-white"
                                        >
                                            <CardContent className="p-4 flex flex-col items-center">
                                                {/* Book Image */}
                                                <div className="w-[400px] h-[250px] relative rounded-lg overflow-hidden">
                                                    <Image
                                                        src={
                                                            book.images[0] instanceof File
                                                                ? URL.createObjectURL(book.images[0])
                                                                : book.images[0]
                                                        }
                                                        alt={book.title}
                                                        fill
                                                        className="object-cover object-center"
                                                    />
                                                </div>
                                                <h3 className="font-bold text-lg mt-3 text-center">{book.title}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{book.author} • {book.category}</p>
                                                <div className="flex items-center justify-center gap-2 mt-2">
                                                    <span className="text-xl font-bold text-green-600">₹{book.finalPrice}</span>
                                                    {book.price > book.finalPrice && (
                                                        <span className="text-sm text-gray-400 line-through">₹{book.price}</span>
                                                    )}
                                                    <p className="flex align-end text-xs text-gray-600">({book.condition})</p>
                                                </div>
                                                {book.price > book.finalPrice && (
                                                    <span className="text-xs font-semibold text-white bg-red-500 px-2 py-1 rounded-lg mt-1">
                                                        Save {calculateDiscount(book.price, book.finalPrice)}%
                                                    </span>
                                                )}
                                                <div className="w-full">
                                                    <Link href={`books/${book._id}`}>
                                                        <Button className="mt-4 w-full bg-amber-400 cursor-pointer hover:bg-amber-500 text-white font-semibold py-2 rounded-lg">
                                                            Buy Now
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>

                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div
                onClick={previousSlide}
                className="absolute cursor-pointer top-1/2 left-1 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
                <ChevronLeft />
            </div>
            <div
                onClick={nextSlide}
                className="absolute cursor-pointer top-1/2 right-1 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
                <ChevronRight />
            </div>
            {/**dot animation */}
            <div className="flex justify-center mt-6">
                {[...Array(totalSlides)].map((_, slideIndex) => (
                    <button
                        key={slideIndex}
                        onClick={() => setCurrentBookSlide(slideIndex)}
                        className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${currentBookSlide === slideIndex ? "bg-blue-600 w-4 h-4" : "bg-gray-400"
                            }`}
                    ></button>
                ))}
            </div>
            <Button size="lg" className="flex mt-10 mx-auto bg-yellow-600 px-8 py-6 rounded-xl hover:bg-yellow-700">
                <Link href="/books">
                    <div className="text-sm">Explore All Books</div>
                </Link>
            </Button>
        </div>
    );
};

export default NewBook;

{
    /**
     * [...Array(totalSlides)] =>iska kam hai 
     *             
     * [undefined, undefined, undefined]  ye create karna 
     * 
     * 
     * slideIndex         slice() Calculation                  Books Dikhne Wale
     *  
     *   0                 slice(0*3, (0+1)*3) → slice(0,3)        [A, B, C]
     *    
     *   1                 slice(1*3, (1+1)*3) → slice(3,6)         [D, E, F]
     * 
     *   2                 slice(2*3, (2+1)*3) → slice(6,9)         [G, H, I]
     * 
     * 
     * 
     */
}
