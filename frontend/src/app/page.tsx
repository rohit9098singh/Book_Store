"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import NewBook from "./component/NewBooks/NewBook";
import SellBooks from "./component/Buy_Sell_Steps/SellBooks";
import BuyBooks from "./component/Buy_Sell_Steps/BuyBooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Page = () => {

  const bannerImages = [
    "/images/book1.jpg",
    "/images/book2.jpg",
    "/images/book3.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const user = useSelector((state: RootState) => state?.user?.user);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);


  return (
    <div className="min-h-screen">
      <div className="relative h-[600px] overflow-hidden    ">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentImage === index ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={image}
              layout="fill"
              objectFit="cover"
              priority={index === 0}
              alt="banner"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ))}
        <div className="relative mx-auto px-4 h-full flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl max-w-7xl md:text-6xl font-bold mb-8">Buy and Sell Old Books Online In India</h1>
          <div className="flex flex-col sm:flex-row gap-6">
            <Button
              size="lg"
              className="group px-8 py-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white "
            >
              <div className="flex items-center gap-3">
                <span className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                  <ShoppingBag className="h-6 w-6" />
                </span>
                <Link href={"/books"}>
                  <p className="text-sm opacity-90">
                    Start Shopping
                  </p>
                  <p className="font-semibold mb-1">
                    Buy Used Books
                  </p>
                </Link>
              </div>
            </Button>
            <Button
              size="lg"
              className="group bg-gradient-to-r from-yellow-600 to-yellow-700 hover:bg-yellow-700 hover:to-yellow-800 px-8 py-6 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="bg-black/30 p-2 rounded-lg group-hover:bg-black/40 transition-colors">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <Link href={"/Book-sell"}>
                  <p className="text-sm opacity-90">
                    Start Selling
                  </p>
                  <p className="font-semibold mb-1">
                    Sell Old Books
                  </p>
                </Link>
              </div>
            </Button>
          </div>
        </div>
      </div>
      <NewBook />
      {/**how to sell section  */}
       <SellBooks/>
      {/**how to buy section */}
        <BuyBooks/>
        {/**blog section at here */}
        {/* <BlogPost/> */}

    </div>
  );
};

export default Page;
