import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { uploadToCloudinary } from "../config/cloudnaryConfig";
import Product from "../models/Products";
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      subject,
      category,
      condition,
      classType,
      price,
      author,
      edition,
      description,
      finalPrice,
      shippingCharge,
      paymentMode,
      paymentDetails,
    } = req.body;

    const sellerId = req.id;

    const images = req.files as Express.Multer.File[];

    if (!images || images.length === 0) {
      return response(res, 400, "image is required");
    }

    // let parsedPaymentDetails = JSON.parse(paymentDetails);

    // if (
    //   paymentMode === "UPI" &&
    //   (!parsedPaymentDetails || !parsedPaymentDetails.upiId)
    // ) {
    //   return response(res, 400, "UPI id is required");
    // }

    // if (
    //   paymentMode === "Bank Account" &&
    //   (!parsedPaymentDetails ||
    //     !parsedPaymentDetails.bankDetails ||
    //     !parsedPaymentDetails.bankDetails.accountNumber ||
    //     !parsedPaymentDetails.bankDetails.ifscCode ||
    //     !parsedPaymentDetails.bankDetails.bankName)
    // ) {
    //   return response(res, 400, "Bank Account Details Is Required");
    // }
    const uploadPromise = images.map((file) => uploadToCloudinary(file as any));

    const uploadImages = await Promise.all(uploadPromise);

    const imageUrl = uploadImages.map((image) => image.secure_url);
    const product = new Product({
      title,
      subject,
      category,
      condition,
      classType,
      price,
      author,
      edition,
      description,
      finalPrice,
      shippingCharge,
      paymentMode,
      seller: sellerId,
      // paymentDetails: parsedPaymentDetails,
      
      images: imageUrl,
    });
    await product.save();

    return response(res, 200, "product Created Successfully", product);
  } catch (error: any) {
    return response(res, 500, "Internal server error", error.message);
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({})
    .sort({ createdAt: -1 })
    .populate("seller", "name email");
  return response(res, 200, "Product Fetched Successfully", products);
  } catch (error: any) {
    return response(res, 500, "Internal server error", error.message);
  }

};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "seller",
      select: "name email profilePicture phoneNumber addresses",
      populate: {
        path: "addresses",
        model: "Address",
      },
    });

    if (!product) {
      return response(res, 404, "Product Not Found For This Id");
    }
    return response(res, 200, "Product Fetched Successfully", product);
  } catch (error: any) {
    return response(res, 500, "Internal server error", error.message);
  }
};


export const deleteProduct=async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId)

    if (!product) {
      return response(res, 404, "Product Not Found For This Id");
    }
  
  return response(res, 200, "Product Fetched Successfully", product);
  } catch (error: any) {
    return response(res, 500, "Internal server error", error.message);
  }
}

export const getProductBySellerId=async(req: Request, res: Response)=>{
  try {
    const sellerId=req.params.sellerId
    if(!sellerId){
      return response(res,400,"Seller not Found plese provide a valid seller id over here ")
    }
    const product = await Product.find({seller:sellerId}).sort({createdAt:-1})
    .populate("seller", "name email profilePicture phoneNumber addresses")
   
    if (!product) {
      return response(res, 404, "Product Not Found For for this seller");
    }
    return response(res, 200, "Product Fetched by sellerid Successfully", product);
  } catch (error: any) {
    return response(res, 500, "Internal server error", error.message);
  }
}
