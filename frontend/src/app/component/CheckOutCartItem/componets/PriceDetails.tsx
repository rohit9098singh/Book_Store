import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CreditCard, Shield } from 'lucide-react';
import React from 'react';

interface PriceDetailsProps {
  totalOriginalAmount: number;
  totalAmount: number;
  totalDiscount: number;
  itemCount: number;
  shippingCharge: number
  isProcessing: boolean;
  steps: "cart" | "address" | "payment";
  onProceed: () => void;
  onBack: () => void;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
  totalOriginalAmount, totalAmount, totalDiscount, shippingCharge, onBack, onProceed, itemCount, steps, isProcessing
}) => {
  return (
    <Card className='shadow-lg '>
      <CardHeader>
        <CardTitle className=' text-xl'>Price Details</CardTitle>
        <CardDescription>{""}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex justify-between'>
          <span>Price:{itemCount} items</span>
          <span>₹{totalOriginalAmount}</span>
        </div>
        <div className='flex justify-between text-green-600'>
          <span>Discount:</span>
          <span>- {""}₹{totalDiscount}</span>
        </div>
        <div className='flex justify-between text-green-600'>
          <span>Delivary Charge:</span>
          <span className={`${shippingCharge === 0 ? "text-green-500" : "text-rose-500"}`}>+ {""}₹{shippingCharge === 0 ? "free" : `${shippingCharge}`}</span>
        </div>
        <div className='flex justify-between py-4 border-t-2'>
          <span>Final Amount:</span>
          <span> ₹{totalAmount}</span>
        </div>
      </CardContent>
      <CardFooter className='flex flex-col gap-4'>
        <Button 
          className='bg-blue-600 hover:bg-blue-700 cursor-pointer text-white'
          size="lg"
          disabled={isProcessing}
          onClick={onProceed}
        >
          {isProcessing ? (
            "Processing..."
          ) : steps === "payment" ? (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Continue to Pay
            </>
          ) : (
            <>
              <ChevronRight className="h-4 w-4 mr-2" />
              {steps === "cart" ? "Proceed to Checkout" : "Proceed to Payment"}
            </>
          )}
        </Button>
        {steps !== "cart" && (
           <Button
             variant="outline"
             className='w-full'
             onClick={onBack}
           >
              <ChevronLeft className='h-4 w-4 mr-2'/> Go Back
           </Button>
        )}
        <div className='flex items-center gap-2 text-sm text-gray-600'>
           <Shield className='h-4 w-4'/> 
           <span>Safe and Secure Payments</span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default PriceDetails
