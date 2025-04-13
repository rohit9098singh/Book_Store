"use client"
import { useAddToWishListMutation, useGetCartByUserIdQuery, useRemoveFromCartMutation, useRemoveFromWishlistMutation } from '@/store/api';
import { setCart } from '@/store/slice/cartSlice';
import { addToWishListAction, removeFromWishListAction } from '@/store/slice/wishlistSlice';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const page = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user)
    const { orderId, steps } = useSelector((state: RootState) => state.ckeckout)
    const [showAddressDialogue, setShowAddressDialogue] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { data: cartData, isLoading: isCartLoading } = useGetCartByUserIdQuery(user?._id);
    const [removeFromCart] = useRemoveFromCartMutation();
    const [addToWishList] = useAddToWishListMutation();
    const [removeFromWishlist] = useRemoveFromWishlistMutation();
    const wishList = useSelector((state: RootState) => state.wishlist.items)
    const cart = useSelector((state: RootState) => state.cart)

    useEffect(() => {
        if (cartData?.success && cartData.data) {
            dispatch(setCart(cartData.data))
        }
    }, [cartData, dispatch])

    const handleRemoveItems=async (productId:string)=>{
        try {
            const result=await removeFromCart(productId).unwrap();
            if(result.success && result.data ){
                dispatch(setCart(result.data))
            }
        } catch (error) {
            
        }
    }
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
    return (
        <div>
            hello world
        </div>
    )
}

export default page
