import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Order } from '@/lib/types/type';
import { Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface OrderDetailsDialogeProps {
  order: Order;
}

const StatusStep = ({ title, icon, isCompleted, isActive, }: { title: string; icon: React.ReactNode; isCompleted: boolean; isActive: boolean; }) => {
  return (
    <div className={`flex  items-center ${isCompleted ? 'text-green-500' : isActive ? 'text-blue-500' : 'text-gray-500'}`}>
      <div className={`rounded-full p-2 ${isCompleted ? 'bg-green-100' : isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <span className='text-xs mt-1'>{title}</span>
    </div>
  );
};



const OrderDetails = ({ order }: OrderDetailsDialogeProps) => {
  const statuses = [
    { title: 'Processing', icon: <Package className='w-5 h-5' /> },
    { title: 'Shipped', icon: <Truck className='w-5 h-5' /> },
    { title: 'Delivered', icon: <CheckCircle className='w-5 h-5' /> },
    { title: 'Cancelled', icon: <XCircle className='w-5 h-5' /> },
  ];

  const getStatusIndex = (status: string) => {
    return statuses.findIndex((s) => s.title.toLowerCase() === status.toLowerCase());
  };

  const currentIndex = getStatusIndex(order.status);

  const authors =Array.isArray(order.items)? order.items.map((item) => item.product.author).join(', '):"";


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'ghost'} size={'sm'} className='cursor-pointer'>
          <Eye className='w-4 h-4 mr-2' />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-purple-700'>Order Details</DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          <div className='bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg'>
            <h3 className='font-semibold text-lg text-purple-800 mb-2'>Order Status</h3>
            <div className='flex justify-between items-center'>
              {statuses.map((step, index) => (
                <StatusStep
                  key={index}
                  title={step.title}
                  icon={step.icon}
                  isCompleted={index < currentIndex}
                  isActive={index === currentIndex}
                />
              ))}
            </div>
          </div>
          <div className='bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4'>
            <h3 className='font-semibold text-lg text-blue-800 mb-2'>Items</h3>
            <div className='space-y-4'>
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className='flex items-center space-x-4'>
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.title}
                      width={100}
                      height={100}
                      className='rounded-md object-contain w-60'
                    />
                    <div>
                      <p className='font-medium'>{item.product.subject}</p>
                      <p className='text-sm text-gray-600'>Author(s): {authors}</p>
                      <p className='text-sm'>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-sm text-red-500'>No items available</p>
              )}
            </div>
          </div>

          <div className='bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg'>
            <h3 className='font-semibold text-lg text-green-800 mb-2'>Shipping Address</h3>
            <p>{order?.shippingAddress?.addressLine1}</p>
            <p>
              {order?.shippingAddress?.city}, {order?.shippingAddress?.state},{' '}
              {order?.shippingAddress?.pincode}
            </p>
          </div>
          <div className='bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg'>
            <h3 className='font-semibold text-lg text-green-800 mb-2'>Payment Details</h3>
            <p>Order Id:{order?.paymentDetails?.razorpay_order_id}</p>
            <p>Payment ID:{order?.paymentDetails?.razorpay_payment_id}</p>
             <p>Amount:{order?.totalAmount}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails;
