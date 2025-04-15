"use client";
import { useGetOrderByIdQuery } from '@/store/api';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import confetti from "canvas-confetti";
import BookLoader from '@/lib/BookLoader';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Package, Truck } from 'lucide-react';

const Page = () => {
  const router = useRouter();
  const { orderId } = useSelector((state: RootState) => state.checkout);
  const { data: orderData, isLoading } = useGetOrderByIdQuery(orderId || "");

  useEffect(() => {
    if (!orderId) {
      router.push("/checkout/cart");
    }
  }, [orderId, router]);

  useEffect(() => {
    if (orderData && !isLoading) {
      confetti({
        particleCount: 180,
        spread: 150,
        origin: { y: 0.6 },
      });
    }
  }, [orderData, isLoading]);

  if (isLoading) return <BookLoader />;
  if (!orderData) return null;

  const { totalAmount, items = [], status, createdAt } = orderData.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-2xl bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="text-center border-b pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="mx-auto w-20 h-20 bg-green-600/10 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="h-12 w-12 text-green-600" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-green-700">
              Payment Successful
            </CardTitle>
            <CardDescription className="text-gray-600">
              Thank you for shopping with us! Your order has been <span className="font-semibold">confirmed</span>.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 py-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Order Details */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-lg text-blue-700 mb-2">Order Details</h3>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Order ID:</span>{" "}
                  <span className="text-blue-700">{orderId}</span>
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Date:</span>{" "}
                  <span className="text-blue-700">{new Date(createdAt).toLocaleString()}</span>
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Total Amount:</span>{" "}
                  <span className="text-green-700 font-semibold">₹{totalAmount.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Items:</span>{" "}
                  <span className="text-green-700 font-semibold">{items?.length}</span>
                </p>
              </div>

              {/* Order Status */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-green-700 mb-2">Order Status</h3>
                <div className="flex items-center text-green-600 text-sm">
                  <Package className="w-5 h-5 mr-2" />
                  <span className="font-medium">{status.toUpperCase()}</span>
                </div>
              </div>

              {/* What's Next */}
              <div className='space-y-4'>
                <h3 className='font-semibold text-lg text-gray-700'>What's Next?</h3>
                <ul className='space-y-3'>
                  <motion.li
                    className='flex items-center text-gray-600'
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Calendar className='h-5 w-5 mr-2 text-purple-500' />
                    <span className='text-sm'>You will receive an email confirmation shortly.</span>
                  </motion.li>
                  <motion.li
                    className='flex items-center text-gray-600'
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Truck className='h-5 w-5 mr-2 text-blue-500' />
                    <span className='text-sm'>Your order will be processed and shipped soon.</span>
                  </motion.li>
                  <motion.li
                    className='flex items-center text-gray-600'
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Calendar className='h-5 w-5 mr-2 text-green-500' />
                    <span className='text-sm'>You can track your order status in your account.</span>
                  </motion.li>
                </ul>
              </div>
            </div>

            {/* Button */}
            <div className='mt-8 text-center'>
              <motion.button
                onClick={() => router.push("/")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition duration-300'
              >
                Continue Shopping
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
export default Page;
