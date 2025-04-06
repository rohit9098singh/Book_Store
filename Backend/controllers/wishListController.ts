import { Request, Response } from "express";
import Product from "../models/Products";
import { response } from "../utils/responseHandler";
import WishList from "../models/WishList";
export const addToWishList= async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return response(res, 404, "Product with the specific id cannot be found");
    }

    //  Find existing cart or create new one
    let wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
        wishList = new WishList({ user: userId, products: [] });
    }

    if(!wishList.products.includes(productId)){
        wishList.products.push(productId);
        await wishList.save();
    }

        return response(res, 200, "product added to wishlist successfully", wishList);

  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};
export const removeFromWishList = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { productId } = req.params;

    //  Find existing cart or create new one
    let wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
       return response(res,400,"Whishlist not found for this user");
    }
    
    wishList.products = wishList.products.filter(id => id.toString() !== productId);
    await wishList.save();
    
    return response(res, 200, "product removed from wishlist successfully", wishList);

  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

export const getWishListByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.id;
  
      const wishList = await WishList.findOne({ user: userId }).populate("products");
  
      if (!wishList) {
        return response(res, 400, "wishlist is empty", { products: [] });
      }
  
      return response(res, 200, "User wishlist fetched successfully", wishList);
  
    } catch (error) {
      console.error(error);
      return response(res, 500, "Internal Server Error");
    }
  };
  
  



