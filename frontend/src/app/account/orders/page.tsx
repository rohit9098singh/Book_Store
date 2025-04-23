"use client";
import NoData from '@/app/component/NoData/NoData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BookLoader from '@/lib/BookLoader';
import { Order } from '@/lib/types/type';
import { useGetUserOrdersQuery } from '@/store/api';
import { Calendar, CreditCard, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import OrderDetails from './component/OrderDetails';
import { Button } from '@/components/ui/button';

const Page = () => {
  const { data: orderData, isLoading } = useGetUserOrdersQuery({});
  const [showAllOrders, setShowAllOrders] = useState(false);
  const router = useRouter();

  console.log("lets see the order object", orderData);

  if (isLoading) {
    return <BookLoader />;
  }

  const orders: Order[] = orderData?.data || [];
  const displayedOrders = showAllOrders ? orders : orders.slice(0, 10);

  if (orders.length === 0) {
    return (
      <div className='my-10 max-w-3xl justify-center mx-auto'>
        <NoData
          imageUrl='/images/no-book.jpg'
          message="You haven't added any book"
          description='Start ordering your book to reach potential buyers. Order your first book now!'
          onClick={() => router.push("/books")}
          buttonText='Order Your First Book'
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow-lg p-8'>
        <h1 className='text-3xl font-bold mb-2 sm:text-4xl'>My Orders</h1>
        <p className='text-purple-100'>View and manage your recent purchases</p>
      </div>
      <div className='grid gap-6 md:grid-cols-2'>
        {displayedOrders.map((order) => (
          <Card key={order?._id} className='flex flex-col gap-1'>
            <CardHeader className='bg-gradient-to-r from-purple-50 to-pink-50'>
              <CardTitle className='text-lg sm:text-xl text-purple-700 flex items-center'>
                <ShoppingBag className='h-5 w-5 mr-2' />
                Order #{order?._id.slice(-10)}
              </CardTitle>
              <CardDescription className='flex items-center'>
                <Calendar className='h-4 w-4 mr-1' />
                {new Date(order.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex-grow'>
              <div className='space-y-2'>
                <div>
                  {Array.isArray(order?.items) ? (
                    <div className='text-sm flex flex-col gap-2 text-gray-600'>
                      <p className='font-medium'>
                        {order.items.map((item) => item?.product?.title).filter(Boolean).join(", ")}
                      </p>
                      <div className='flex gap-2'>
                        <span>
                          <strong>Subject:</strong>{" "}
                          {order.items
                            .map((item) => item?.product?.subject?.trim())
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                        <span>
                          <strong>Author:</strong>{" "}
                          {order.items
                            .map((item) => item?.product?.author?.trim())
                            .filter(Boolean)
                            .join(", ")}
                        </span>

                      </div>
                    </div>
                  ) : (
                    "No items"
                  )}

                </div>
                <div className='flex text-sm items-center'>
                  <CreditCard className='h-4 w-4 mr-2' />
                  Total: ₹{order.totalAmount}
                </div>
                <div className='flex items-center space-x-2'>
                  <span className='text-sm'>Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "shipped" ? "bg-green-100 text-green-800" : order.status === "processing" ? "bg-yellow-100 text-yellow-800" :order.status==="shipped"? "bg-blue-100 text-blue-800":"bg-red-100 text-red-800"}`}>{order?.status.charAt(0).toUpperCase() +order.status.slice(1)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className='bg-purple-50'>
                 <OrderDetails order={order}/>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className='flex justify-center'>
          <Button onClick={()=>setShowAllOrders(!showAllOrders)} className='bg-gradient-to-r from-purple-500 to-pink-500 text-white'>
             {showAllOrders ? "show less":"view all orders"}
          </Button>
      </div>
    </div>
  );
};

export default Page;
