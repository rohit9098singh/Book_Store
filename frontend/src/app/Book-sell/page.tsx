"use client"

import type React from "react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { useAddProductMutation } from "@/store/api"
import type { RootState } from "@/store/store"
import type { BookDetails } from "@/lib/types/type"
import toast from "react-hot-toast"
import { toggleLoginDialogue } from "@/store/slice/userSlice"
import NoData from "../component/NoData/NoData"
import Link from "next/link"
import { Book, Camera, ChevronRight, CreditCard, DollarSign, HelpCircle, Loader2, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { filters } from "@/lib/constants"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const Page = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [addProduct, { isLoading }] = useAddProductMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user)

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
      category: "",
      paymentDetails: {
        upiId: "",
        bankDetails: {
          accountNumber: "",
          ifscCode: "",
          bankName: "",
        },
      },
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      const currentFiles = watch("images") || []

      if (currentFiles.length + newFiles.length > 4) {
        toast.error("Only 4 images are allowed!")
        return
      }

      const newImageURLs = newFiles.map((file) => URL.createObjectURL(file))
      setUploadedImages((prevImg) => [...prevImg, ...newImageURLs].slice(0, 4))
      setValue("images", [...currentFiles, ...newFiles].slice(0, 4))
    }
  }

  const handleRemoveImages = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    const currentFiles = watch("images") || []
    const uploadFiles = currentFiles.filter((_, i) => i !== index)
    setValue("images", uploadFiles)
  }

  const onSubmit = async (data: BookDetails) => {
    console.log("Form submitted with data:", data) // Debug log
    setIsSubmitting(true)

    try {
      console.log("Inside the onSubmit function")
      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images" && key !== "paymentDetails") {
          formData.append(key, value as string)
        }
      })

      if (Array.isArray(data.images) && data.images.length > 0) {
        data.images.forEach((image) => formData.append("images", image))
      }

      if (data.paymentMode === "UPI") {
        formData.set("paymentDetails", JSON.stringify({ upiId: data.paymentDetails.upiId }))
      } else if (data.paymentMode === "Bank Account") {
        formData.set("paymentDetails", JSON.stringify({ bankDetails: data.paymentDetails.bankDetails }))
      }

      const result = await addProduct(formData).unwrap()
      if (result.success) {
        router.push(`/books/${result.data._id}`)
        toast.success("Book added successfully")
        reset()
      }
    } catch (error) {
      toast.error("Failed to list the book, please try again later")
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const paymentMode = watch("paymentMode")

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialogue())
  }

  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    )
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
          <Link href="#" className="text-blue-600 hover:underline inline-flex items-center font-medium">
            Learn how it works
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 ">
          {/* Book Details Card */}
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 mx-2 rounded-xl p-4">
              <CardTitle className="text-2xl text-blue-700 flex items-center">
                <Book className="mr-2 h-6 w-6" />
                Book Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Title */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4  ">
                <Label htmlFor="title" className="md:w-1/4 font-medium text-gray-700">
                  Add Title:
                </Label>
                <div className="md:w-3/4">
                  <Input
                    type="text"
                    id="title"
                    placeholder="Enter book title"
                    {...register("title", { required: "Title is required" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="category" className="md:w-1/4 font-medium text-gray-700">
                  Book Types:
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Please select a book type" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Please Select Book Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {filters.category.map((category: string) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>
              </div>

              {/* Condition */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 font-medium text-gray-700">Book Condition:</Label>
                <div className="md:w-3/4">
                  <Controller
                    name="condition"
                    control={control}
                    rules={{ required: "Book Condition Is Required" }}
                    render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                        {filters.condition.map((con: string) => (
                          <div key={con} className="flex items-center space-x-2">
                            <RadioGroupItem value={con.toLowerCase()} id={con.toLowerCase()} />
                            <Label htmlFor={con.toLowerCase()}>{con}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>}
                </div>
              </div>

              {/* Class Type */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 font-medium text-gray-700">For Class Type:</Label>
                <div className="md:w-3/4">
                  <Controller
                    name="classType"
                    control={control}
                    rules={{ required: "Please select a class type" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Please Select Class Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {filters.classType.map((type: string) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.classType && <p className="text-red-500 text-sm mt-1">{errors.classType.message}</p>}
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="subject" className="md:w-1/4 font-medium text-gray-700">
                  Book/Subject:
                </Label>
                <div className="md:w-3/4">
                  <Input
                    type="text"
                    id="subject"
                    placeholder="Enter subject"
                    {...register("subject", { required: "Subject is required" })}
                    className="w-full"
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="images" className="block mb-2 font-medium text-gray-700">
                  Upload Photos
                </Label>
                <label
                  htmlFor="images"
                  className="border-2 cursor-pointer border-dashed border-blue-300 rounded-lg p-4 bg-blue-50 flex flex-col items-center mx-auto gap-3"
                >
                  <Camera className="text-blue-500 h-8 w-8" />
                  <span className="text-blue-500 hover:underline text-center">
                    Click here to upload up to 4 images <br />
                    (Size: 15MB max, each)
                  </span>
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`book image ${index + 1}`}
                            width={200}
                            height={200}
                            className="rounded-xl object-cover w-full h-32 border border-gray-200"
                          />
                          <Button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveImages(index)
                            }}
                            size="icon"
                            className="absolute -right-2 -top-2 cursor-pointer"
                            variant="destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </label>
                <input
                  onChange={handleImageUpload}
                  id="images"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                />
              </div>
            </CardContent>
          </Card>

          {/* Optional Details Card */}
          <Card className="shadow-lg border-t-4 border-t-green-500 overflow-hidden px-4 rounded-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 py-4 px-6">
              <CardTitle className="text-2xl text-green-700 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-green-600" />
                Optional Details
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                (Description, MRP, Author, etc...)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 px-6 pb-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-base text-green-800 hover:text-green-900">
                    Book Information
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-700 leading-relaxed">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Label htmlFor="price" className="md:w-1/4 font-medium text-gray-700">
                          MRP:
                        </Label>
                        <div className="md:w-3/4">
                          <Input type="text" placeholder="Enter Book MRP" {...register("price")} className="w-full" />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Label htmlFor="author" className="md:w-1/4 font-medium text-gray-700">
                          Author:
                        </Label>
                        <Input
                          type="text"
                          id="author"
                          placeholder="Enter book author name"
                          {...register("author")}
                          className="md:w-3/4 w-full"
                        />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Label htmlFor="edition" className="md:w-1/4 font-medium text-gray-700">
                          Edition (Year):
                        </Label>
                        <Input
                          type="text"
                          id="edition"
                          placeholder="Enter book edition here"
                          {...register("edition")}
                          className="md:w-3/4 w-full"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-base text-green-800 hover:text-green-900">
                    Book Description
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-700 leading-relaxed">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                        <Label htmlFor="description" className="md:w-1/4 font-medium text-gray-700">
                          Enter Book Description
                        </Label>
                        <Textarea
                          placeholder="Enter Book Description"
                          id="description"
                          {...register("description")}
                          className="md:w-3/4 w-full"
                          rows={4}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Price Details Card */}
          <Card className="shadow-lg border-t-4 border-t-yellow-500">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 mx-2 rounded-xl p-4">
              <CardTitle className="text-2xl text-yellow-700 flex items-center">
                <DollarSign className="mr-2 h-6 w-6" />
                Price Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="finalPrice" className="md:w-1/4 font-medium text-gray-700">
                  Your Price (₹):
                </Label>
                <div className="md:w-3/4">
                  <Input
                    type="text"
                    id="finalPrice"
                    placeholder="Book final price..."
                    {...register("finalPrice", { required: "Final price is required" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.finalPrice && <p className="text-red-500 text-sm mt-1">{errors.finalPrice.message}</p>}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 mt-2 font-medium text-gray-700">Shipping Charges:</Label>
                <div className="space-y-2 md:w-3/4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="text"
                      id="shippingCharge"
                      placeholder="Enter Shipping Charge..."
                      {...register("shippingCharge")}
                      className="w-full md:w-1/2"
                      disabled={watch("shippingCharge") === "free"}
                    />
                    <span className="text-sm">Or</span>
                    <Controller
                      name="shippingCharge"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="freeShipping"
                          checked={field.value === "free"}
                          onCheckedChange={(checked) => field.onChange(checked ? "free" : "")}
                        />
                      )}
                    />
                    <Label htmlFor="freeShipping">Free Shipping</Label>
                  </div>
                </div>
              </div>
              <p className="text-center text-foreground">Buyers prefer free shipping or low shipping charges</p>
            </CardContent>
          </Card>

          {/* Bank Details Card */}
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 mx-2 rounded-xl p-4">
              <CardTitle className="text-2xl text-blue-600 flex items-center">
                <CreditCard className="mr-2 h-6 w-6" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 font-medium text-gray-700">Payment Mode:</Label>
                <div className="md:w-3/4 space-y-2">
                  <p className="text-sm text-neutral">
                    After your book is sold, in what mode would you like to receive the payment?
                  </p>
                  <Controller
                    name="paymentMode"
                    control={control}
                    rules={{ required: "Payment mode is required" }}
                    render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="UPI" id="UPI" />
                          <Label htmlFor="UPI" className="text-gray-600">
                            UPI ID/Number
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Bank Account" id="bank-account" />
                          <Label htmlFor="bank-account" className="text-gray-600">
                            Bank Account
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.paymentMode && <p className="text-red-500 text-sm mt-1">{errors.paymentMode.message}</p>}
                </div>
              </div>

              {paymentMode === "UPI" && (
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                  <Label htmlFor="upiId" className="md:w-1/4 font-medium text-gray-700">
                    UPI ID:
                  </Label>
                  <div className="md:w-3/4">
                    <Input
                      type="text"
                      id="upiId"
                      placeholder="Enter UPI ID"
                      {...register("paymentDetails.upiId", {
                        required: "UPI ID is required",
                        pattern: {
                          value: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/,
                          message: "Invalid UPI ID format",
                        },
                      })}
                      className="w-full"
                    />
                    {errors.paymentDetails?.upiId && (
                      <p className="text-red-500 text-sm mt-1">{errors.paymentDetails.upiId.message}</p>
                    )}
                  </div>
                </div>
              )}

              {paymentMode === "Bank Account" && (
                <>
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label htmlFor="accountNumber" className="md:w-1/4 font-medium text-gray-700">
                      Account Number:
                    </Label>
                    <div className="md:w-3/4">
                      <Input
                        type="text"
                        id="accountNumber"
                        placeholder="Your Account No.."
                        {...register("paymentDetails.bankDetails.accountNumber", {
                          required: "Account number is required",
                          pattern: {
                            value: /^[0-9]{9,18}$/,
                            message: "Invalid account number format",
                          },
                        })}
                        className="w-full"
                      />
                      {errors.paymentDetails?.bankDetails?.accountNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.paymentDetails.bankDetails.accountNumber.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label htmlFor="ifscCode" className="md:w-1/4 font-medium text-gray-700">
                      IFSC Code:
                    </Label>
                    <div className="md:w-3/4">
                      <Input
                        type="text"
                        id="ifscCode"
                        placeholder="Your Bank IFSC Code"
                        {...register("paymentDetails.bankDetails.ifscCode", {
                          required: "IFSC code is required",
                          pattern: {
                            value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                            message: "Invalid IFSC code format",
                          },
                        })}
                        className="w-full uppercase"
                      />
                      {errors.paymentDetails?.bankDetails?.ifscCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.paymentDetails.bankDetails.ifscCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label htmlFor="bankName" className="md:w-1/4 font-medium text-gray-700">
                      Bank Name:
                    </Label>
                    <div className="md:w-3/4">
                      <Input
                        type="text"
                        id="bankName"
                        placeholder="Your Bank Name"
                        {...register("paymentDetails.bankDetails.bankName", {
                          required: "Bank name is required",
                        })}
                        className="w-full"
                      />
                      {errors.paymentDetails?.bankDetails?.bankName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.paymentDetails.bankDetails.bankName.message}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-60 cursor-pointer text-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-orange-600 hover:to-orange-700 font-semibold py-6 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              {isLoading || isSubmitting ? (
                <div className="flex gap-3 items-center">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Saving <span className="animate-bounce">...</span>
                </div>
              ) : (
                "Post Your Book"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page
