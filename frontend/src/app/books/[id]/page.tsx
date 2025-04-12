"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { Heart, Loader2, Share2, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import BookSellerDetails from '../component/BookSellerDetails'
import HowItWorks from '../component/HowItWorks'
import { useAddToCartMutation, useAddToWishListMutation, useGetProductByIdQuery, useRemoveFromWishlistMutation } from '@/store/api'
import BookInfo from '../component/BookDetailsPage'
import { BookDetails } from '@/lib/types/type'
import BookLoader from '@/lib/BookLoader'
import NoData from '@/app/component/NoData/NoData'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { addToCartSlice } from "@/store/slice/cartSlice"
import toast from 'react-hot-toast'
import { addToWishListAction, removeFromWishListAction } from '@/store/slice/wishlistSlice'
import ShareButton from '@/app/component/shareButton/ShareButton'

const Page = () => {
    const params = useParams();
    const id = params.id;
    const router = useRouter();

    const [selectedImage, setSelectedImage] = useState(0);
    const [isAddToCart, setIsAddToCart] = useState(false);

    const [book, setBook] = useState<BookDetails | null>(null);

    const dispatch = useDispatch()
    const { data: apiResponse = {}, isLoading, isError } = useGetProductByIdQuery(id);
    const [addToCart] = useAddToCartMutation();
    const [addToWishList] = useAddToWishListMutation();
    const [removeFromWishlist] = useRemoveFromWishlistMutation();

    const wishList = useSelector((state: RootState) => state.wishlist.items)
    const user = useSelector((state: RootState) => state.user.user);
    console.log("take the user", user)

    const userId = user._id

    useEffect(() => {
        if (apiResponse.success) {
            setBook(apiResponse.data);
        }
    }, [apiResponse]);

    if (isLoading || !book) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <BookLoader />
            </div>
        );
    }
    if (!book || isError) {
        <NoData
            imageUrl="/images/no-book.jpg"
            message="You haven't order any books yet."
            description="Start order your books to reach potential buyers. order your first book now!"
            onClick={() => router.push("/Book-sell")}
            buttonText="Order Your First Book"
        />
    }

    const bookImage = book?.images || [];

    const handleAddToCart = async () => {
        if (book) {
            setIsAddToCart(true);
            try {
                const result = await addToCart({
                    productId: book?._id,
                    quantity: 1,
                }).unwrap();
                if (result.success && result.data) {
                    dispatch(addToCartSlice(result.data));
                    toast.success(result.message || "product added to your cart successfully")
                }
                else {
                    throw new Error(result.message || "failed to add to cart")
                }
            } catch (error: any) {
                const errorMessage = error?.data?.message;
                toast.error(errorMessage)
            }
            finally { setIsAddToCart(false) }
        }
    };

    const handleAddToWhistlist = async (productId: string) => {
        try {
            const isWishList = wishList.some((item) => item.products.includes(productId))
            console.log("it is tru or false", isWishList)
            if (isWishList) {
                const result = await removeFromWishlist(productId).unwrap();
                if (result.success) {
                    dispatch(removeFromWishListAction(productId));
                    toast.success(result.message || "product removed from the wishlist")
                }
                else {
                    throw new Error(result.message || "failed to remove from the wishlist")
                }
            } else {
                const result = await addToWishList(productId).unwrap();
                if (result.success) {
                    dispatch(addToWishListAction(result.data));
                    toast.success(result.message || "Added to wishlist");
                } else {
                    throw new Error(result.message || "Failed to add to wishlist")
                }
            }
        } catch (error: any) {
            const errorMessage = error?.data?.message;
            toast.error(errorMessage || "failed to add or remove to wishlist");
        }
    };

    const calculateDiscount = (price: number, finalPrice: number): number => {
        return price > finalPrice && price > 0
            ? Math.round(((price - finalPrice) / price) * 100)
            : 0;
    };

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    };

    return (
        <div className="min-h-screen bg-amber-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <nav className="mb-6 flex items-center text-sm text-gray-600">
                    <Link href="/" className="text-black text-lg hover:underline">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/books" className="text-black text-lg hover:underline">Books</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-600">{book.category}</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-600">{book.title}</span>
                </nav>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Book Images */}
                    <div className="space-y-4">
                        <div className="relative h-[400px] overflow-hidden rounded-lg border bg-white">
                            <img
                                src={bookImage[selectedImage] instanceof File ? URL.createObjectURL(bookImage[selectedImage]) : bookImage[selectedImage]}
                                alt={book.title}
                                className="object-contain"
                            />
                            {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                <Badge className="absolute left-2 top-2 z-10 bg-orange-600/90 text-white hover:bg-orange-700 px-2 py-1 rounded">
                                    {calculateDiscount(book.price, book.finalPrice)}% OFF
                                </Badge>
                            )}
                        </div>

                        <div className="flex gap-2 overflow-x-auto">
                            {bookImage.map((images, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative h-16 w-16 overflow-hidden rounded-lg border transition-all duration-300 ${selectedImage === index ? "ring-2 ring-blue-500 scale-105" : "hover:scale-105"
                                        }`}
                                >
                                    <img
                                        src={images instanceof File ? URL.createObjectURL(images) : images}
                                        alt={`${book?.title} ${index + 1}`}
                                        className="object-cover cursor-pointer"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold">{book.title}</h1>
                                <p className="text-sm">Posted {formatDate(book.createdAt)}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <ShareButton
                                    url={`${window.location.origin}/books/${book._id}`}
                                    title={`Check out this book: ${book.title}`}
                                    text={`I found this interesting book on BookKart: ${book.title}`}
                                />

                                <Button
                                    size="sm"
                                    onClick={() => handleAddToWhistlist(book._id)}
                                    variant="outline"
                                    className="flex items-center px-4 py-2 border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-400 transition duration-300 rounded-lg cursor-pointer"
                                >
                                    <Heart className={`h-5 w-5 text-red-600 transition duration-300 ${wishList.some((w) => w.products.includes(book._id)) ? "fill-red-500" : ""}`} />
                                    <span className="hidden md:block ml-2 text-sm font-medium">{`${wishList.some((w) => w.products.includes(book._id)) ? "Remove" : "Add"}`}</span>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-start mt-2">
                                <p className="text-black text-lg font-semibold">{book.finalPrice}</p>
                                <p className="text-red-500 line-through text-sm ml-2">{book.price}</p>
                                <Badge variant="secondary" className="text-green-700">Shipping Available</Badge>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                disabled={isAddToCart}
                                className="w-60 py-6 bg-amber-500 hover:bg-amber-600 text-black"
                            >
                                {isAddToCart ? (
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Loader2 className="animate-spin text-blue-500" size={20} />
                                        <span>Adding to Cart ...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        <ShoppingCart className="text-blue-500" size={24} />
                                        <span>Buy Now</span>
                                    </div>
                                )}
                            </Button>

                            <BookInfo book={book} />
                            <BookSellerDetails book={book} />
                        </div>
                    </div>
                </div>

                <HowItWorks />
            </div>
        </div>
    );
};

export default Page;
