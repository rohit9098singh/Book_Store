"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { filters } from '@/lib/constants';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from "date-fns"
import BookLoader from '@/lib/BookLoader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from "framer-motion"
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Pagination from '../component/Pagination/Pagination';
// import { Heart } from 'lucide-react';
import NoData from '../component/NoData/NoData';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAddToWishListMutation, useGetAllProductsQuery, useRemoveFromWishlistMutation } from '@/store/api';
import { BookDetails } from '@/lib/types/type';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishListAction, removeFromWishListAction } from '@/store/slice/wishlistSlice';
import toast from 'react-hot-toast';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';

const page = () => {
    const [currentpage, setCurrentPage] = useState(1);
    const [selectedCondition, setSelectedCondition] = useState<string[]>([]); //(["New", "Used"])
    const [selectedType, setSelectedType] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState("newest");
    const [books, setBooks] = useState<BookDetails[]>([])
    const { data: apiResponse = {}, isLoading } = useGetAllProductsQuery({});
    const router = useRouter();
    const dispatch = useDispatch()
    const [addToWishList] = useAddToWishListMutation();
    const [removeFromWishlist] = useRemoveFromWishlistMutation();
    const bookPerPages = 6;

    const wishList = useSelector((state: RootState) => state.wishlist.items)

    const searchTerms = new URLSearchParams(window.location.search).get("search") || "";


    useEffect(() => {
        if (apiResponse.success) {
            setBooks(apiResponse.data)
        }
    }, [apiResponse])

    const toggleFilter = (section: string, item: string) => {
        const updateFilter = (prev: string[]) => {
            if (prev.includes(item)) {
                return prev.filter((i) => i !== item); // Remove item if already selected
            } else {
                return [...prev, item]; // Add item if not selected
            }
        };

        switch (section) {
            case "condition":
                setSelectedCondition((prev) => updateFilter(prev));
                break;
            case "classType":
                setSelectedType((prev) => updateFilter(prev));
                break;
            case "category":
                setSelectedCategory((prev) => updateFilter(prev));
                break;
            default:
                break;
        }
        setCurrentPage(1);
    };

    const filterBooks = books.filter((book) => {


        const conditionMatch = selectedCondition.length === 0 ||
            selectedCondition.map(condition => condition.toLowerCase()).includes(book.condition.toLowerCase());

        const typeMatch = selectedType.length === 0 ||
            selectedType.map(type => type.toLowerCase()).includes(book.classType.toLowerCase());

        const categoryMatch = selectedCategory.length === 0 ||
            selectedCategory.map(category => category.toLowerCase()).includes(book.category.toLowerCase());

        const searchMatch = searchTerms ?
            book.title.toLowerCase().includes(searchTerms.toLowerCase().trim()) ||
            book.author.toLowerCase().includes(searchTerms.toLowerCase().trim()) ||
            (typeof book.category === 'string' && book.category.toLowerCase().includes(searchTerms.toLowerCase().trim())) ||
            book.subject.toLowerCase().includes(searchTerms.toLowerCase().trim())
            : true;


        return conditionMatch && typeMatch && categoryMatch && searchMatch;
    });

    const sortedBooks = [...filterBooks].sort((a, b) => {
        switch (sortOption) {
            case "newest":
                return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

            case "oldest":
                return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            case "price-low":
                return a.finalPrice - b.finalPrice
            case "price-high":
                return b.finalPrice - a.finalPrice

            default:
                return 0
        };
    })

    const totalPages = Math.ceil(sortedBooks.length / bookPerPages);

    const paginatedBooks = sortedBooks.slice((currentpage - 1) * bookPerPages, currentpage * bookPerPages);
    console.log("this is the paginated book", paginatedBooks)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
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
    const handleAddToWhistlist = async (productId: string) => {
        try {
            const isWishList = wishList.some((item: any) => item.products.includes(productId))
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

    return (

        <div className='min-h-screen bg-gray-50'>
            <div className='mx-auto max-w-7xl px-6 py-10'>
                <nav className='mb-6 flex items-center text-sm text-gray-600'>
                    <Link href="/" className='text-black text-lg hover:underline'>Home</Link>
                    <span className='mx-2'>/</span>
                    <span className='text-gray-500'>Books</span>
                </nav>

                <h1 className='mb-10 text-3xl font-bold text-gray-800'>Find From Over 1000s Of Used Books Online</h1>

                <div className='grid md:grid-cols-[280px_1fr] gap-6'>
                    <div className='space-y-6'>
                        {
                            paginatedBooks.length ? (

                                <Accordion type="multiple" className="bg-white p-6 border rounded-lg shadow-sm">
                                    {Object.entries(filters).map(([key, values]) => (
                                        <AccordionItem key={key} value={key}>
                                            <AccordionTrigger className="text-lg font-semibold text-blue-500">
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {values.map((value) => (
                                                    <div key={value} className="flex items-center space-x-2 py-1 cursor-pointer">
                                                        <Checkbox
                                                            id={value}
                                                            checked={
                                                                key === "condition" ? selectedCondition.includes(value) :
                                                                    key === "classType" ? selectedType.includes(value) :
                                                                        selectedCategory.includes(value)
                                                            }
                                                            onCheckedChange={() => toggleFilter(key, value)}
                                                        />
                                                        <label htmlFor={value} className="text-sm font-medium text-gray-700">
                                                            {value}
                                                        </label>
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <></>
                            )
                        }
                    </div>

                    {/* Main Content */}
                    <div className='space-y-6'>
                        {isLoading ? (
                            <BookLoader />
                        ) : paginatedBooks.length ? (
                            <div>
                                <div className='flex justify-between items-center mb-6'>
                                    <h2 className='text-xl font-semibold text-gray-800'>
                                        Buy Second Hand Books, Used Books Online In India
                                    </h2>
                                    <Select value={sortOption} onValueChange={setSortOption}>
                                        <SelectTrigger className='w-[180px] bg-white border shadow-sm rounded-md'>
                                            <SelectValue placeholder="Sort By" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='newest'>Newest First</SelectItem>
                                            <SelectItem value='oldest'>Oldest First</SelectItem>
                                            <SelectItem value='price-low'>Price: Low To High</SelectItem>
                                            <SelectItem value='price-high'>Price: High To Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Books Grid */}
                                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                                    {paginatedBooks.map((book) => (
                                        <motion.div
                                            key={book._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Card className="group  relative overflow-hidden rounded-lg transition-shadow hover:shadow-2xl  bg-white border w-full ">
                                                <CardContent className="p-4">
                                                    <Link href={`/books/${book._id}`}>
                                                        <div className="relative w-full">
                                                            <Image
                                                                src={typeof book.images[0] === 'string' ? book.images[0] : URL.createObjectURL(book.images[0])}
                                                                alt={book.title}
                                                                height={100}
                                                                width={400}
                                                                className="h-[250px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                            {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                                                <Badge className="absolute left-2 top-2 z-10 bg-orange-600/90 text-white hover:bg-orange-700 px-2 py-1 rounded">
                                                                    {calculateDiscount(book.price, book.finalPrice)}% OFF
                                                                </Badge>
                                                            )}
                                                            <button
                                                                className="absolute right-2 top-2 rounded-full bg-white/80 cursor-pointer p-2 transition-all duration-300 hover:bg-white shadow-lg hover:shadow-xl active:scale-100"
                                                            >
                                                                <Heart
                                                                    onClick={() => handleAddToWhistlist(book._id)}
                                                                    size={20} className="text-red-500 transition-transform duration-200 hover:scale-110" />
                                                            </button>
                                                        </div>

                                                        <div className="mt-3">
                                                            <h3 className="text-lg font-semibold text-orange-600 truncate">{book.title}</h3>
                                                            <p className="text-neutral-600 text-sm">{book.author}</p>
                                                        </div>

                                                        <div className="flex items-center justify-start mt-2">
                                                            <p className="text-green-600 text-lg font-semibold">{book.finalPrice}</p>
                                                            <p className="text-red-500 line-through text-sm ml-2">{book.price}</p>
                                                        </div>

                                                        <div className="flex justify-between items-center text-sm text-neutral-500 mt-3">
                                                            <p>{formatDate(book.createdAt)}</p>
                                                            <p className="text-xs font-semibold text-gray-600">{book.condition}</p>
                                                        </div>
                                                    </Link>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={currentpage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        ) : (
                            <div className='text-center text-gray-500 text-lg'>
                                <NoData
                                    imageUrl="/images/no-book.jpg"
                                    message="You haven't order any books yet."
                                    description="Start order your books to reach potential buyers. order your first book now!"
                                    onClick={() => router.push("/books")}
                                    buttonText="Order Your First Book"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page;


{
    /**
     * Maan lo Pehle Filter Khaali Hai
     * User ne "New" select kiya
     * 
     * Pehle selectedCondition empty    hai:selectedCondition = []
     * 
     * toggleFilter("condition", "New") call hoga.
     * 
     * updateFilter([]) chalega:
     *[].includes("New") → false 
     *Return hoga → ["New"]
     * selectedCondition = ["New"]
     * 
     * User ne "New" dubara click kiya (remove karna hai)
     * Pehle selectedCondition me already new hai:
     * selectedCondition = ["New"]
        toggleFilter("condition", "New") call hoga.

        updateFilter(["New"]) chalega:

        ["New"].includes("New") → true

         Return hoga → ["New"].filter((i) => i !== "New") → []
    
        ==============================================================

         {Object.entries(filters).map(([key, values]) => (
            <AccordionItem key={key} value={key}>
          
            filters is an object where keys represent filter categories (e.g., "condition", "classType", etc.).

            Object.entries(filters) converts it into an array and loops over each category:

                        {
            condition: ["New", "Used"],
            classType: ["Fiction", "Non-fiction"],
            category: ["Science", "History"]
            }

       */



    {

        /**=================================================================== 
         * ye kaise kam karega yaha par thoda dhyan se dekho
         *    1) Jab koi filter select nahi kiya (selectedCondition = [])
         *        => selectedCondition = [];
         *       book = { title: "Book A", condition: "New" };
         *      
         *   2)  Step 1: Pehle check karega
         *         => selectedCondition.length === 0
         *            Kyunki selectedCondition empty hai, toh
         *          
         *         => 0 === 0  // True
         *    
         *    3) Step 2: || operator ki wajah se right side execute hi nahi *hoti
         *        =>    true || selectedCondition.includes("New") 
         *              = true || (code chalne ki zaroorat nahi)
         *              = true
         *   Note=> Matlab: Sab books match ho jayengi.
         * 
         *    4)   Example 2 - Jab ["New"] select kiya
         *  
         *           => selectedCondition = ["New"];
         *              book = { title: "Book A", condition: "New" };
         * 
         *         Step 1: Pehle check karega
         *           => selectedCondition.length === 0
         *              Kyunki selectedCondition me ek item hai (["New"]), toh
         *              1 === 0  // ❌ False
         *         
         *         Step 2: Ab right side check hogi
         *                 ["New"].includes("New")  // ✅ True
         *               Final Condition:
         *                   false || true = true
         * 
         *       note => Matlab: "New" wali book list me dikhegi. 
         *
         */
    }

}