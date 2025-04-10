'use client';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useAddProductMutation } from '@/store/api';
import { RootState } from '@/store/store';
import { BookDetails } from '@/lib/types/type';
import toast from 'react-hot-toast';
import { toggleLoginDialogue } from '@/store/slice/userSlice';
import NoData from '../component/NoData/NoData';
import Link from 'next/link';
import { Book, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { filters } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Page = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [addProduct] = useAddProductMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm<BookDetails>({
    defaultValues: {
      images: [],
      category: ""
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    // Step 1: Check if user selected any files
    if (files && files.length > 0) {
      const newFiles = Array.from(files); // Step 2: Convert FileList to Array<File>
      const currentFiles = watch('images') || []; // Step 3: Get already uploaded files (form se)

      //  Step 4: Limit check — max 4 images allowed
      if (currentFiles.length + newFiles.length > 4) {
        toast.error("only 4 images are allowed !");
        return;
      }

      // Step 5: Create preview URLs from new files (sirf dikhane ke liye)
      const newImageURLs = newFiles.map((file) => URL.createObjectURL(file));
      setUploadedImages((prevImg) =>
        [...prevImg, ...newImageURLs].slice(0, 4)
      );

      setValue('images', [...currentFiles, ...newFiles].slice(0, 4));
    }
  };


  const handleRemoveImages = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    {
      /** Ye watch() aur setValue() kyu kiya jaa raha hai?
          Kyunki tumne form ke andar images: File[] banayi thi, aur jab tum submit karte ho to backend ko actual File objects bhejne hote hain — preview URL nahi!

          So agar user koi image remove karta hai, to sirf preview hata dena kaafi nahi hai — tumhe form ke images field se bhi us File object ko hatana padta hai.
       */
    }
    const currentFiles = watch("images") || [];
    const uploadFiles = currentFiles.filter((_, i) => i !== index);
    setValue("images", uploadFiles)
  }


  const onSubmit = async (data: BookDetails) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value as string)
        }
      })
      if (Array.isArray(data.images) && data.images.length > 0) {
        data.images.forEach((image) => formData.append("images", image));
      }
      if (data.paymentMode === "UPI") {
        formData.set("paymentDetails", JSON.stringify({ upiId: data.paymentDetails.upiId }))
      }
      else if (data.paymentMode === "Bank Account") {
        formData.set("paymentDetails", JSON.stringify({ bankDetails: data.paymentDetails.bankDetails }))
      }

      const result = await addProduct(formData).unwrap();
      if (result.success) {
        router.push("/books/${result.data.i_id}");
        toast.success("book added successfully");
        reset();
      }
    } catch (error) {
      toast.error("failed to list the book , please try again later")
      console.log(error);
    }
  }

  const paymentMode = watch("paymentMode");
  // ye isliye watch kar pa raha tha kyu ke yah useForm<BookDetails>() ka type bookdetails or bookdetials ke andar paymentMode define hai bahahr he 
  const handleOpenLogin = () => {
    dispatch(toggleLoginDialogue())
  }
  if (!user) {
    <NoData
      message="Please log in to access your cart."
      description="You need to be logged in to view your cart and checkout."
      buttonText="Login"
      imageUrl="/images/login.jpg"
      onClick={handleOpenLogin}
    />

  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Sell Your Used Books</h1>
          <p className="text-lg text-gray-600 mb-4">
            List your second-hand books for sale — it's free and available all over India!
          </p>
          <Link
            href="#"
            className="text-blue-600 hover:underline inline-flex items-center font-medium"
          >
            Learn how it works
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
          <Card className='shadow-lg border-t-4 border-t-blue-500'>
            <CardHeader className='bg-gradient-to-r from-blue-50 to-indigo-50 mx-2 rounded-xl'>
              <CardTitle className='text-2xl text-blue-700 flex items-center'>
                <Book className='mr-2 h-6 w-6' />
                Book Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6 pt-6'>
              <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                <Label htmlFor='title' className='md:w-1/4 font-medium text-gray-700'>
                  Add Title :
                </Label>
                <div className='md:w-3/4'>
                  <Input
                    type="text"
                    id="title"
                    placeholder="Enter book title"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>}
                </div>
              </div>
              <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                <Label htmlFor='category' className='md:w-1/4 font-medium text-gray-700'>
                  Book Types :
                </Label>
                <div className="md:w-3/4 ">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Please select a book type" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Please Select Book Type" />
                        </SelectTrigger>
                        <SelectContent >
                          {
                            filters.category.map((category: string) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className='text-red-500 text-sm mt-1'>{errors.category.message}</p>}
                </div>
              </div>
              <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                <Label htmlFor='category' className='md:w-1/4 font-medium text-gray-700'>
                  Book Condition :
                </Label>
                <div className="md:w-3/4 ">
                  <Controller
                    name="condition"
                    control={control}
                    rules={{ required: "Book Condition Is Required" }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className='flex space-x-4'
                      >
                        {
                          filters.condition.map((con: string) => (
                            <div
                              key={con}
                              className='flex items-center space-x-2'
                            >
                              <RadioGroupItem value={con.toLowerCase()} id={con.toLowerCase()}/>
                               <Label htmlFor={con.toLowerCase()} >
                                {con}
                               </Label>
                            </div>
                    ))
                        }
                </RadioGroup>
                    )}
                  />
                {errors.category && <p className='text-red-500 text-sm mt-1'>{errors.category.message}</p>}
              </div>
            </div>

          </CardContent>
        </Card>
      </form>
    </div>

    </div >
  );
};

export default Page;

