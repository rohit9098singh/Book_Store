import { Request, Response } from "express";
import Cart from "../models/CartItem";
import { response } from "../utils/responseHandler";
import Order from "../models/Order";

export const createOrUpdateOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const {
      orderId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentDetails,
    } = req.body;

    if (!userId) {
      return response(res, 400, "User not authenticated");
    }

    const cart = await Cart.findOne({ userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return response(res, 400, "Your cart seems to be empty");
    }

    let order;

    if (orderId) {
      order = await Order.findById(orderId);

      if (!order) {
        return response(res, 404, "Order not found with given ID");
      }

      order.shippingAddress = shippingAddress || order.shippingAddress;
      order.paymentMethod = paymentMethod || order.paymentMethod;
      order.totalAmount = totalAmount || order.totalAmount;

      if (paymentDetails) {
        order.paymentDetails = paymentDetails;
        order.paymentStatus = "complete";
        order.status = "processing";
      }

      await order.save();
      return response(res, 200, "Order updated successfully", order);
    }

    order = new Order({
      user: userId,
      items: cart.items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentDetails: paymentDetails || null,
      paymentStatus: paymentDetails ? "complete" : "pending",
      status: paymentDetails ? "processing" : "pending",
    });

    await order.save();
    if (paymentDetails) {
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } },
        { new: true }
      );
    }

    return response(res, 201, "Order created successfully", order);
  } catch (error) {
    return response(res, 500, "Something went wrong", error);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate("user", "name email") // only name and email from User
        .populate("shippingAddress") // entire Address
        .populate({
          path: "items.product", // nested populate
          model: "Product",
        });
  
      if (!order) {
        return response(res, 404, "Order not found for this ID");
      }
  
      return response(res, 200, "Order fetched successfully", order);
    } catch (error: any) {
      return response(res, 500, "Internal server error", error.message);
    }
  };


    export const getOrderByUserId = async (req: Request, res: Response) => {
        try {
            const userId = req.id;
        
            const orders = await Order.find({ user: userId })
              .sort({ createdAt: -1 })
              .populate({
                path: "items.product",
                model: "Product",
              });
        
            return response(res, 200, "Orders fetched successfully", orders);
          } catch (error: any) {
            return response(res, 500, "Internal server error", error.message);
          }
        };
