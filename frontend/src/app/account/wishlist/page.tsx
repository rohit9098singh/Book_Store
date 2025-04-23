"use client"
import NoData from '@/app/component/NoData/NoData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BookLoader from '@/lib/BookLoader';
import { BookDetails } from '@/lib/types/type';
import { useAddToCartMutation, useGetWishlistByUserIdQuery, useRemoveFromWishlistMutation } from '@/store/api';
import { addToCartSlice } from '@/store/slice/cartSlice';
import { removeFromWishListAction } from '@/store/slice/wishlistSlice';
import { RootState } from '@/store/store';
import { Check, Heart, Loader2, ShoppingCart, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addToCart] = useAddToCartMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const [isAddToCart, setIsAddToCart] = useState(false);

  const wishList = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart.items);

  const { data: wishListData, isLoading } = useGetWishlistByUserIdQuery({});
  const [wishlistItems, setWishListItems] = useState<BookDetails[]>([])

  useEffect(() => {
    if (wishListData?.success) {
      setWishListItems(wishListData?.data?.products)
    }
  }, [wishListData])


  const handleAddToCart = async (productId: string) => {
    setIsAddToCart(true);
    try {
      const result = await addToCart({
        productId: productId,
        quantity: 1
      }).unwrap();

      if (result.success && result.data) {
        dispatch(addToCartSlice(result.data));
        toast.success(result.message || "Product added to your cart successfully");
      } else {
        throw new Error(result.message || "Failed to add to cart");
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error.message || "Failed to add to cart";
      toast.error(errorMessage);
    } finally {
      setIsAddToCart(false);
    }
  };

  const toggleWishList = async (productId: string) => {
    try {
      const isWishListed = wishList.some((item) => item.products.includes(productId));
      if (isWishListed) {
        const result = await removeFromWishlist(productId).unwrap();
        if (result.success) {
          dispatch(removeFromWishListAction(productId));
          toast.success(result.message || "Product removed from the wishlist");
        } else {
          throw new Error(result.message || "Failed to remove from the wishlist");
        }
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error.message || "Failed to remove from wishlist";
      toast.error(errorMessage);
    }
  };

  const isItemsInCart = (productId: string) => {
    return cart.some((cartItem) => cartItem.product._id === productId)
  }

  if (isLoading) {
    return <BookLoader />
  }

  if (wishlistItems.length === 0) {
    return (
      <NoData
        message='your wishlist is empty'
        description='looks like you havent aded any item to your wishlist yet'
        buttonText='Browse Books'
        imageUrl='/images/cart.webp'
        onClick={() => router.push("/books")}
      />
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-centers space-x-2'>
        <Heart className='h-6 w-6 text-rose-600' />
        <h3 className='text-2xl font-bold '>My Wishlist</h3>
      </div>
      <div className='grid gap-4 grid-cols-2 lg:grid-cols-3'>
        {
          wishlistItems.map((item) => (
            <Card key={item._id}>
              <CardHeader>
                <CardTitle>
                  {item.title}
                </CardTitle>
                <CardDescription>
                  ₹{item.finalPrice.toFixed()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={typeof item.images[0] === 'string' ? item.images[0] : URL.createObjectURL(item.images[0])}
                  alt={item.title}
                  className='aspect-square w-full object-cover'
                />
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button
                  onClick={() => toggleWishList(item._id)}
                  variant="outline"
                  size="icon"
                  className="group relative flex items-center justify-center rounded-md  border border-red-300 bg-red-50 p-2 text-red-600 transition-all hover:bg-red-600 hover:text-white focus:outline-none cursor-pointer duration-300"
                >
                  <Trash2 className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="sr-only">Remove from wishlist</span>
                </Button>

                {
                  isItemsInCart(item._id) ? (
                    <Button disabled>
                      <Check className="mr-2 h-5 w-5 " />
                      item in cart
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleAddToCart(item._id)}
                      className=" bg-amber-500 hover:bg-amber-600 text-black"
                    >
                      {isAddToCart ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Loader2 className="animate-spin text-blue-500" size={20} />
                          <span>Adding to Cart ...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                          <ShoppingCart className="text-blue-500" size={24} />
                          <span>Add To Cart</span>
                        </div>
                      )}
                    </Button>
                  )
                }

              </CardFooter>
            </Card>
          ))
        }
      </div>
    </div>
  );
};

export default Page;
