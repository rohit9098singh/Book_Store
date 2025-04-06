import { Request, Response } from "express";
import Product from "../models/Products";
import { response } from "../utils/responseHandler";
import Cart, { ICartItem } from "../models/CartItem";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return response(res, 404, "Product with the specific id cannot be found");
    }

    //  Check: seller is not adding their own product
    if (product.seller.toString() === userId) {
      return response(res, 400, "You cannot add your product to cart");
    }

    //  Find existing cart or create new one
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    //  Check if product is already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      //  If exists, increase quantity
      existingItem.quantity += quantity;
    } else {
      //  Else, push new item
      const newItem={
        product:productId,
        quantity:quantity
      }
      cart.items.push(newItem as ICartItem)
    }

    //  Save cart
    await cart.save();
    return response(res, 200, "Item added to cart successfully", cart);

  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { productId } = req.params;

    //  Find existing cart or create new one
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
       return response(res,400,"Cart not found for this user");
    }

    const itemExists = cart.items.some(item => item.product.toString() === productId);
    if (!itemExists) {
      return response(res, 404, "Item not found in cart");
    }
    
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    
    return response(res, 200, "Item removed from cart successfully", cart);

  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

export const getCartByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
  
      let cart = await Cart.findOne({ user: userId }).populate({
        path: "items.product"
      });
  
      if (!cart) {
        return response(res, 400, "Cart is empty", { items: [] });
      }
  
      return response(res, 200, "User cart fetched successfully", cart);
  
    } catch (error) {
      console.error(error);
      return response(res, 500, "Internal Server Error");
    }
  };
  



