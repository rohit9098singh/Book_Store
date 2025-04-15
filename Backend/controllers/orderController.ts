import { Request, Response } from "express";
import Cart from "../models/CartItem";
import { response } from "../utils/responseHandler";
import Order from "../models/Order";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto"
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY as string,
  key_secret: process.env.RAZORPAY_SECRET as string,
});

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

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return response(res, 400, "Your cart seems to be empty");
    }

    let order;

    if (orderId) {
      //  If orderId is sent from frontend
      order = await Order.findById(orderId);

      if (!order) {
        return response(res, 404, "Order not found with given ID");
      }
    } else {
      //  If no orderId is sent, try to find a pending order for the user
      order = await Order.findOne({ user: userId, status: "pending" });
    }

    if (order) {
      //  Update existing order
      order.items = cart.items; // in case cart has changed
      order.shippingAddress = shippingAddress || order.shippingAddress;
      order.paymentMethod = paymentMethod || order.paymentMethod;
      order.totalAmount = totalAmount || order.totalAmount;

      if (paymentDetails) {
        order.paymentDetails = paymentDetails;
        order.paymentStatus = "complete";
        order.status = "processing";
      }

      await order.save();

      //  Clear cart if payment done
      if (paymentDetails) {
        await Cart.findOneAndUpdate(
          { user: userId },
          { $set: { items: [] } },
          { new: true }
        );
      }

      return response(res, 200, "Order updated successfully", order);
    }

    //  No existing order, create a new one
    const newOrder = new Order({
      user: userId,
      items: cart.items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentDetails: paymentDetails || null,
      paymentStatus: paymentDetails ? "complete" : "pending",
      status: paymentDetails ? "processing" : "pending",
    });

    await newOrder.save();

    //  Clear cart if payment done
    if (paymentDetails) {
      await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } },
        { new: true }
      );
    }

    return response(res, 201, "Order created successfully", newOrder);
  } catch (error) {
    console.error("backend error", error);
    return response(res, 500, "Something went wrong", error);
  }
};


// koi bhi user ka order check krne ke liye for
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("user", "name email phoneNumber") // only name and email from User
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

export const getOrderOfLoggedInUser = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    if (!userId) {
      return response(res, 401, "Unauthorized: User ID missing");
    }

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

//======================================== Razor Pay Api's =============================================

export const createPaymentWithRazorpay = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return response(res, 404, "Order Not Found");
    }

    const razorPayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: `reciept_order_${order._id.toString()}`,
    });

    return response(res, 200, "Razorpay Order and payment  Created successfully", {order:razorPayOrder});
  } catch (error:any) {
    return response(res, 500, "Error creating Razorpay order", error.message);
  }
};


export const handleRazorPayWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.WEBHOOK_SECRET as string;

    // 1️ Razorpay se aayi request asli hai ya nahi, ye verify karne ke liye HMAC signature banate hain
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body)); // poore body ka fingerprint banate hain
    const digest = shasum.digest("hex"); // uska hex format ka output lete hain

    // 2 Jo signature Razorpay ne bheja hai usse compare karte hain
    const signature = req.headers["x-razorpay-signature"];

    if (digest === signature) {
      // 3 Webhook se payment aur order ka data nikalte hain
      const paymentId = req.body.payload.payment.entity.id;
      const razorpayOrderId = req.body.payload.payment.entity.order_id;

      // 4️ Apne database me us order ko update karte hain jiska payment hua hai
      await Order.findOneAndUpdate(
        { "paymentDetails.razorpay_order_id": razorpayOrderId }, // jiska order_id match kare
        {
          paymentStatus: "complete", // payment successful
          status: "processing", // ab order process hone laga
          "paymentDetails.razorpay_payment_id": paymentId, // payment ka ID save kar lete hain
        },
        { new: true }
      );

      return response(res, 200, "Webhook processed successfully");
    } else {
      // 5️ Signature match nahi hua — iska matlab request fake ho sakti hai
      return response(res, 400, "Invalid signature");
    }
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return response(res, 500, "Internal Server Error", error.message);
  }
};



{
  /**
   *   Razor pay working
   *
   *   1)The Razorpay SDK has a built-in orders object [with a create() method.]
   *     So once you call new Razorpay(...), you get access to that structure:
   *
   *     ex:->razorpay.orders.create({...})
   *
   */
}
