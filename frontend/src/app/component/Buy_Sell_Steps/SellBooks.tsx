import React from 'react'
import { ShoppingBag, CreditCard, Truck } from "lucide-react"


const book = [
    {
      step: "Step 1",
      title: "Seller posts an Ad",
      description: "Seller posts an ad on book kart to sell their used books.",
      icon: <ShoppingBag className="h-12 w-12 text-amber-600" />,
    },
    {
      step: "Step 2",
      title: "Buyer Pays Online",
      description: "Buyer makes an online payment to book kart to buy those books.",
      icon: <CreditCard className="h-12 w-12 text-amber-600" />,
    },
    {
      step: "Step 3",
      title: "Seller ships the books",
      description: "Seller then ships the books to the buyer",
      icon: <Truck className="h-12 w-12 text-amber-600" />,
    },
  ]

const SellBooks = () => {
    return (
        <div className='py-20 bg-amber-100 '>
            <div className='container mx-auto px-4'>
                <h1 className='text-center font-bold mb-4 text-3xl text-black'>How To Sell Your Old Books Online On BookKart?</h1>
                <p className='text-gray-600 text-md font-semibold max-w-xl text-center mx-auto'>Earning money by selling your old books is just 3 steps away from you :)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    {book.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 hover:duration-300 flex flex-col items-center text-center"
                        >
                            <div className="mb-4 p-3 bg-amber-200/40 rounded-full">{item.icon}</div>
                            <div className="font-bold bg-emerald-600/20 px-4 py-1 shadow-md rounded-xl text-emerald-500 mb-2">{item.step}</div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SellBooks
