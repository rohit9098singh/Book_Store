"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Package, Trash2 } from "lucide-react";

import { RootState } from "@/store/store";
import { useDeleteProductMutation, useGetProductsBySellerIdQuery } from "@/store/api";
import { BookDetails } from "@/lib/types/type";
import BookLoader from "@/lib/BookLoader";
import NoData from "@/app/component/NoData/NoData";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: products, isLoading } = useGetProductsBySellerIdQuery(user._id);
  const [deleteProduct] = useDeleteProductMutation();
  const [books, setBooks] = useState<BookDetails[]>([]);

  useEffect(() => {
    if (products?.success) {
      setBooks(products.data);
    }
  }, [products]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete the product");
    }
  };

  if (isLoading) {
    return <BookLoader />;
  }

  if (books.length === 0) {
    return (
      <div className="my-10 max-w-3xl mx-auto">
        <NoData
          imageUrl="/images/no-book.jpg"
          message="You haven't sold any books yet"
          description="Start selling your books to reach potential buyers. List your book now and make it available to others."
          onClick={() => router.push("/book-sell")}
          buttonText="Sell your book"
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white py-2">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Your Listed Books</h1>
          <p className="text-lg text-gray-600">Manage and track your book listings</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((product: BookDetails) => (
            <Card
              key={product._id}
              className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-purple-200"
            >
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4">
                <CardTitle className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {product.title}
                </CardTitle>
                <CardDescription>{product.subject}</CardDescription>
              </CardHeader>

              <CardContent className="p-4 flex flex-col items-center">
                <div className="relative w-40 h-52 mb-4">
                  <Image
                    src={
                      typeof product.images[0] === "string"
                        ? product.images[0]
                        : URL.createObjectURL(product.images[0])
                    }
                    alt={product.title}
                    fill
                    className="rounded-md object-contain"
                  />
                </div>

                <div className="space-y-1 text-sm text-center text-gray-700">
                  <p><span className="font-medium">Category:</span> {product.category}</p>
                  <p><span className="font-medium">Class:</span> {product.classType}</p>
                </div>

                <div className="flex items-center justify-center gap-2 mt-3">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-base px-2 py-1">
                    ₹{product.finalPrice}
                  </Badge>
                  <span className="line-through text-gray-400 text-sm">₹{product.price}</span>
                </div>
              </CardContent>

              <CardFooter className="bg-purple-50 p-4 flex justify-end">
                <Button
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
