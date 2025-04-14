"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  ChevronRight,
  CreditCard,
  MapPin,
  ShoppingCart
} from 'lucide-react';

import CheckOutCartItem from '@/app/component/CheckOutCartItem/componets/CheckOutCartItem';
import PriceDetails from '@/app/component/CheckOutCartItem/componets/PriceDetails';
import NoData from '@/app/component/NoData/NoData';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Address } from '@/lib/types/type';
import {
  useAddToWishListMutation,
  useCreateOrUpdateOrderMutation,
  useCreateRazorpayPaymentMutation,
  useGetCartByUserIdQuery,
  useGetOrderByIdQuery,
  useRemoveFromCartMutation,
  useRemoveFromWishlistMutation
} from '@/store/api';
import {
  setCart
} from '@/store/slice/cartSlice';
import {
  setCheckoutSteps,
  setOrderId
} from '@/store/slice/checkoutSlice';
import {
  toggleLoginDialogue
} from '@/store/slice/userSlice';
import {
  addToWishListAction,
  removeFromWishListAction
} from '@/store/slice/wishlistSlice';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CheckoutAddress from '@/app/component/CheckOutCartItem/componets/CheckoutAddress';


const page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { orderId, steps } = useSelector((state: RootState) => state.checkout);
  const [showAddressDialogue, setShowAddressDialogue] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: cartData, isLoading: isCartLoading } = useGetCartByUserIdQuery(user?._id);
  const [removeFromCart] = useRemoveFromCartMutation();
  const [addToWishList] = useAddToWishListMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [createOrUpdateOrder] = useCreateOrUpdateOrderMutation();
  const wishList = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart);
  const { data: orderData, isLoading: isOrderLoading } = useGetOrderByIdQuery(orderId || "");
  const [createRazorpayPayment] = useCreateRazorpayPaymentMutation();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);


  useEffect(() => {
    if (orderData && orderData.data && orderData.data.length > 0) {
      setSelectedAddress(orderData.data[0].shippingAddress);
    }
  }, [orderData]);

  useEffect(() => {
    if (steps === "address" && !selectedAddress) {
      setShowAddressDialogue(true);
    }
  }, [steps]);

  useEffect(() => {
    if (cartData?.success && cartData.data) {
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);

  const handleRemoveItems = async (productId: string) => {
    try {
      const result = await removeFromCart(productId).unwrap();
      if (result.success && result.data) {
        dispatch(setCart(result.data));
        toast.success(result.message || "items removed successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("failed to remove from the cart");
    }
  };

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialogue());
  };

  const handleAddToWhistlist = async (productId: string) => {
    try {
      const isWishList = wishList.some((item) => item.products.includes(productId));
      if (isWishList) {
        const result = await removeFromWishlist(productId).unwrap();
        if (result.success) {
          dispatch(removeFromWishListAction(productId));
          toast.success(result.message || "product removed from the wishlist");
        } else {
          throw new Error(result.message || "failed to remove from the wishlist");
        }
      } else {
        const result = await addToWishList(productId).unwrap();
        if (result.success) {
          dispatch(addToWishListAction(result.data));
          toast.success(result.message || "Added to wishlist");
        } else {
          throw new Error(result.message || "Failed to add to wishlist");
        }
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message;
      toast.error(errorMessage || "failed to add or remove to wishlist");
    }
  };

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + (item.product.finalPrice * item.quantity),
    0
  );

  const totalOriginalAmount = cart.items.reduce(
    (acc, item) => acc + (item.product.price * item.quantity),
    0
  );

  const totalDiscount = totalOriginalAmount - totalAmount;

  const shippingCharge = cart.items.map((item) => item.product.shippingCharge.toLowerCase() === "free" ? 0 : parseFloat(item.product.shippingCharge) || 0)

  const maximumShippingCharge = Math.max(...shippingCharge, 0);
  const finalAmount = totalAmount + maximumShippingCharge

  const handleProceedToCheckout = async () => {
    console.log("yah aaya",cart.items)

    try {
      if (steps === "cart") {
        console.log("aage gya")

        //Jab tu cart step pe hota hai, order abhi tak server pe exist nahi karta.
        //Toh wo yaha pe createOrUpdateOrder() ko call karta hai first time:
        // Isse ek naya order create hota hai (server me).
        const result = await createOrUpdateOrder({
          orderData: {
            items: cart.items,
            totalAmount: totalAmount,
            
          }
        }).unwrap();
        console.log("try ke andar aaya ke nhi vo")
        console.log("check the result",result.success)
        
        if (result.success) {
          toast.success("Order created successfully");
          dispatch(setOrderId(result.data._id));
          // order ka ID store hota hai Redux store me
          dispatch(setCheckoutSteps("address"));
          //next step: address pe le jaata hai
        } else {
          throw new Error(result.message);
        }

      } else if (steps === "address") {
        if (selectedAddress) {
          dispatch(setCheckoutSteps("payment"));
        } else {
          setShowAddressDialogue(true);
        }
      } else if (steps === "payment") {
        handlepayment();
      }
    } catch (error) {
      toast.error("Failed to proceed with checkout");
      console.error("Checkout error this is :", error);
    }
  };

  const handleSelectAddress = async (address: Address) => {
    setSelectedAddress(address);
    setShowAddressDialogue(false);
    if (orderId) {
      try {
        //Jab tu address select karta hai, us time pe tujhe existing order ke andar address update karna padta hai.
        //Isliye yeh call kiya ja raha: createOrUpdateOrder
        await createOrUpdateOrder({
          orderId,
          orderData: {
            shippingAddress: address,
            status: "processing"
          }
        }).unwrap();

        toast.success("Address updated successfully");
      } catch (error) {
        console.log(error);
        toast.error("failed to update address");
      }
    }
  };

  const handlepayment = () => {
    // Payment handler logic here
  };

  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }

  if (cart.items.length === 0) {
    return (
      <NoData
        message="Your cart seems to be empty"
        description="Looks like you havent added any items yet,Explore our collection and find something you love! "
        buttonText="Browse Books"
        imageUrl="/images/cart.webp"
        onClick={() => router.push("/books")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-100 py-5 px-8 shadow-sm mb-10">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <ShoppingCart className="h-7 w-7 text-orange-500" />
          <span className="text-xl font-semibold text-gray-800">
            Your cart has {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mx-auto px-4 max-w-6xl">
        <div className="mb-8 py-6 px-4 rounded-lg">
          <div className="flex justify-center items-center gap-6">
            {/* Cart Step */}
            <div className="flex items-center gap-2">
              <div className={`rounded-full p-3 transition duration-200 ${steps === "cart" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                <ShoppingCart className="h-6 w-6 cursor-pointer" />
              </div>
              <span className="font-medium text-gray-800 hidden md:block">Cart</span>
            </div>

            <ChevronRight className="h-5 w-5 text-gray-400" />

            {/* Address Step */}
            <div className="flex items-center gap-2">
              <div className={`rounded-full p-3 transition duration-200 ${steps === "address" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                <MapPin className="h-6 w-6 cursor-pointer" />
              </div>
              <span className="font-medium text-gray-800 hidden md:block">Address</span>
            </div>

            <ChevronRight className="h-5 w-5 text-gray-400" />

            {/* Payment Step */}
            <div className="flex items-center gap-2">
              <div className={`rounded-full p-3 transition duration-200 ${steps === "payment" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                <CreditCard className="h-6 w-6 cursor-pointer" />
              </div>
              <span className="font-medium text-gray-800 hidden md:block">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <div>
            <Card className="shadow-lg ">
              <CardHeader>
                <CardTitle className="text-2xl">Order Summary</CardTitle>
                <CardDescription>Review Your Items</CardDescription>
              </CardHeader>
              <CardContent>
                <CheckOutCartItem
                  items={cart.items}
                  onRemoveItem={handleRemoveItems}
                  onToggleWishlist={handleAddToWhistlist}
                  wishlist={wishList}
                />
              </CardContent>
            </Card>
          </div>

          {/* Price Details */}
          <div>
            <PriceDetails
              totalOriginalAmount={totalOriginalAmount}
              totalAmount={finalAmount}
              totalDiscount={totalDiscount}
              itemCount={cart.items.length}
              isProcessing={isProcessing}
              shippingCharge={maximumShippingCharge}
              steps={steps}
              onProceed={handleProceedToCheckout}
              onBack={() =>
                dispatch(setCheckoutSteps(steps === "address" ? "cart" : "address"))
              }
            />
            {
              selectedAddress && (
                <Card className='mt-6 mb-6 shadow-lg'>
                  <CardHeader>
                    <CardTitle className='text-xl'>
                      Delivary Address
                    </CardTitle>
                    <CardDescription>{" "}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-1'>
                      <p>{selectedAddress?.state}</p>
                      <p>{selectedAddress?.addressLine2 && (
                        selectedAddress.addressLine2
                      )}</p>
                      <p>{selectedAddress.city},{selectedAddress.state}{" "}{selectedAddress.pincode}</p>
                      <p>Phone:{selectedAddress.phoneNumber}</p>
                    </div>
                    <Button onClick={() => setShowAddressDialogue(true)} variant={"outline"}>
                      <MapPin className='h-4 w-4 mr-2' /> Change Address
                    </Button>
                  </CardContent>
                </Card>
              )
            }
          </div>
        </div>
        <Dialog open={showAddressDialogue} onOpenChange={setShowAddressDialogue}>
          <DialogContent className='sm:max-w-[600px] '>
            <DialogHeader>
              <DialogTitle>
                Select Or Add Delivary Address
              </DialogTitle>
              <DialogDescription>
                {""}
              </DialogDescription>
            </DialogHeader>
            <CheckoutAddress
              onAddressSelect={handleSelectAddress}
              selectedAddressId={selectedAddress?._id || ""}
            />

          </DialogContent>
        </Dialog>
      </div>
    </div>

  );
};

export default page;