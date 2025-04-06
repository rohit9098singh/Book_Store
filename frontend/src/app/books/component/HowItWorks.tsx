import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react'
const SellingSteps = [
    {
        step: "Step 1",
        title: "Seller posts an Ad",
        description:
            "Seller posts an ad on book kart to sell their used books.",
        image: { src: "/icons/ads.png", alt: "Post Ad" },
    },
    {
        step: "Step 2",
        title: "Buyer Pays Online",
        description:
            "Buyer makes an online payment to book kart to buy those books.",
        image: { src: "/icons/pay_online.png", alt: "Payment" },
    },
    {
        step: "Step 3",
        title: "Seller ships the books",
        description: "Seller then ships the books to the buyer.",
        image: { src: "/icons/fast-delivery.png", alt: "Shipping" },
    },
];
const HowItWorks = () => {
    return (
        <div className=' mt-12  '>
            <h2 className='mb-5 text-2xl font-bold'>How Does It Works</h2>
            <div className='grid md:grid-cols-3 gap-8'>
                {
                    SellingSteps.map((step, index) => (
                        <Card
                         key={index}
                         className="border-none  bg-gradient-to-br from-amber-50 to bg-amber-100 shadow-md rounded-xl p-4">
                            <CardHeader className="pb-2">
                                <Badge className=" mb-2 bg-emerald-600/30 text-emerald-500 px-3 py-1">
                                    {step.step}
                                </Badge>
                                <CardTitle className="text-lg font-semibold">
                                    {step.title}
                                </CardTitle>
                                <CardDescription>{step.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Image
                                  src={step.image.src}
                                  alt={step.title}
                                  height={120}
                                  width={120}
                                //   fill
                                />
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        </div>
    )
}

export default HowItWorks
