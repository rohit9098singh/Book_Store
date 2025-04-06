"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { Heart, Loader2, Share2, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import BookDetails from '../component/BookDetails'
import BookSellerDetails from '../component/BookSellerDetails'
import { Card } from '@/components/ui/card'
import HowItWorks from '../component/HowItWorks'



const book = {
    _id: "1",
    images: ["/images/book1.jpg", "/images/book2.jpg", "/images/book3.jpg",],
    title: "The Alchemist",
    category: "Reading Books (Novels)",
    condition: "Excellent",
    classType: "B.Com",
    subject: "Fiction",
    price: 300,
    author: "Paulo Coelho",
    edition: "25th Anniversary Edition",
    description: "A philosophical book about a shepherd's journey to realize his dreams.",
    finalPrice: 250,
    shippingCharge: 50,
    paymentMode: "UPI",
    paymentDetails: {
        upiId: "example@upi"
    },
    createdAt: new Date("2024-01-01"),
    seller: { name: "John Doe", contact: "1234567890" }
}


  

const page = () => {
    const params = useParams();
    const id = params.id
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAddToCart, setIsAddToCart] = useState(false)

    const router = useRouter();

    const bookImage = book?.images || []

    const handleAddToCart = (productId: string) => {

    }

    const handleAddToWhistlist = (productId: string) => {

    }
    const calculateDiscount = (price: number, finalPrice: number): number => {
        return price > finalPrice && price > 0
            ? Math.round(((price - finalPrice) / price) * 100)
            : 0;
    };

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString)
        return formatDistanceToNow(date, { addSuffix: true })
    }

    return (
        <div className='min-h-screen bg-amber-50'>
            <div className='max-w-7xl mx-auto px-4 py-8'>
                <nav className='mb-6 flex items-center text-sm text-gray-600'>
                    <Link href="/" className='text-black text-lg hover:underline'>Home</Link>
                    <span className='mx-2'>/</span>
                    <Link href="/books" className='text-black text-lg hover:underline'>Books</Link>
                    <span className='mx-2'>/</span>
                    <span className='text-gray-600'>{book.category}</span>
                    <span className='mx-2'>/</span>
                    <span className='text-gray-600'>{book.title}</span>
                </nav>
                <div className='grid md:grid-cols-2 gap-8'>
                    <div className='space-y-4'>
                        <div className='relative h-[400px] overflow-hidden rounded-lg border bg-white '>
                            <Image
                                src={bookImage[selectedImage]}
                                alt={book.title}
                                fill
                                className='object-contain'
                            />
                            {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                <Badge
                                    className="absolute left-2 top-2 z-10 bg-orange-600/90 text-white hover:bg-orange-700 px-2 py-1 rounded">
                                    {calculateDiscount(book.price, book.finalPrice)}% OFF
                                </Badge>
                            )}
                        </div>
                        <div className='flex gap-2 overflow-x-auto'>
                            {bookImage.map((images, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative h-16 w-16 overflow-hidden rounded-lg border transition-all duration-300 ${selectedImage === index ? "ring-2 ring-blue-500 scale-105" : "hover:scale-105"}`}
                                >
                                    <Image
                                        src={images}
                                        alt={`${book.title} ${index + 1}`}
                                        fill
                                        className='object-cover'

                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    {/**book details */}
                    <div className='space-y-6'>
                        <div className='flex item-center justify-between'>
                            <div className='space-y-2'>
                                <h1 className='text-2xl font-bold'>{book.title}</h1>
                                <p className='text-sm '>
                                    Posted {formatDate(book.createdAt)}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Share Button */}
                                <Button
                                    variant="outline"
                                    className="px-4 py-2 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200 cursor-pointer"
                                >
                                    <Share2 className="h-5 w-5  " />
                                    <span className="hidden md:block ml-2 text-sm font-medium">share</span>
                                </Button>

                                {/* Wishlist Button */}
                                <Button
                                    size="sm"
                                    onClick={() => handleAddToWhistlist(book._id)}
                                    variant="outline"
                                    className="flex items-center px-4 py-2 border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-400 transition duration-300 rounded-lg cursor-pointer"
                                >
                                    <Heart className={`h-5 w-5 fill-red-500 text-red-600 transition duration-300`} />
                                    <span className="hidden md:block ml-2 text-sm font-medium">Add</span>
                                </Button>
                            </div>
                        </div>
                        <div className='space-y-4'>
                            <div className="flex items-center justify-start mt-2">
                                <p className="text-black text-lg font-semibold">{book.finalPrice}</p>
                                <p className="text-red-500 line-through text-sm ml-2">{book.price}</p>
                                <Badge
                                    variant={"secondary"}
                                    className='text-green-700'>Shippig Available</Badge>
                            </div>
                            <Button className='w-60 py-6 bg-amber-500 hover:bg-amber-600 text-black'>
                                {isAddToCart ? (
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Loader2 className="animate-spin text-blue-500" size={20} />
                                        <span>Adding to Cart ...</span>
                                    </div>

                                ) : (
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        <ShoppingCart className="animate-spin text-blue-500" size={24} />
                                        <span>Buy Now</span>
                                    </div>
                                )}
                            </Button>
                            <BookDetails book={book}/>  
                            <BookSellerDetails book={book}/>

                        </div>
                    </div>
                </div>
                <HowItWorks/>    
            </div>
        </div>
    )
}


export default page
