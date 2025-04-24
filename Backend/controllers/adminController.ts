import { Request, Response } from "express";
import SellerPayment from "../models/SellerPayment";
import { response } from "../utils/responseHandler";
import Order from "../models/Order";
import Product from "../models/Products";
import User from "../models/User";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, paymentStatus, startDate, endDate } = req.query;

    // Fetching all orders which have been paid (completed payments)
    const paidOrderRecord = await SellerPayment.find().select("order");

    // Extracting only the order IDs
    const paidOrderIds = paidOrderRecord.map((record) => record.order.toString());

    // Building the query object dynamically based on request query parameters
    const query: any = {
      paymentStatus: "completed", // Default to "completed" status
      _id: { $nin: paidOrderIds }, // Excluding orders that have already been paid
    };

    // If status is provided in query, filter by status
    if (status) {
      query.status = status;
    }

    // If paymentStatus is provided, use that, otherwise default to "completed"
    query.paymentStatus = paymentStatus || "completed";

    // If both startDate and endDate are provided, filter orders created within that range
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    // Fetching the orders using the dynamic query
    const orders = await Order.find(query)
      .populate({
        path: "item.product",
        select: "name email phoneNumber paymentDetails", // Selecting the relevant fields to populate
      })
      .populate("user", "name email") // Populating the user details
      .populate("shippingAddress") // Populating shipping address details
      .sort({ createdAt: -1 }); // Sorting by creation date in descending order

    // Return the response with fetched orders
    return response(res, 200, "Orders fetched successfully", orders);

  } catch (error) {
    console.error(error);
    // Handle errors (if any)
    return response(res, 500, "Something went wrong");
  }
};


export const updateOrder=async (req:Request,res:Response)=>{

  try {
    const {id}=req.params;
    const {status,paymentStatus}=req.body;
    const order=await Order.findById(id);

    if(!order){
      return response(res,404,"order not found with this id");
    }

    if(status){
      order.status=status;
    }
    if(paymentStatus){
      order.paymentStatus=paymentStatus;
    }

    await order.save();

    return response(res,200,"order udated succesfully",order)
  } catch (error) {
    console.error("Error updating the order ",error);
    return response(res, 500, "Something went wrong");
  }
    
}

export const processSellerPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params; // Order ID from URL params
    const { productId, paymentMethod, amount, notes } = req.body; // Required fields
    const user = req.id; // Logged-in user ID (assuming it's coming from JWT)

    // Check if required fields are provided
    if (!productId || !paymentMethod || !amount || !notes) {
      return response(res, 400, "Missing required fields: productId, paymentMethod, amount, or notes");
    }

    // Finding the order
    const order = await Order.findById(orderId).populate({
      path: "items.product", // Populate product details
      populate: {
        path: "seller", // Also populate the seller's info
      },
    });

    if (!order) {
      return response(res, 404, "Order not found with this ID");
    }

    // Find the specific product in the order
    const orderItem = order.items.find((item:any) => item.product._id.toString() === productId);

    if (!orderItem) {
      return response(res, 404, "Product not found in this order");
    }

    // Assuming you want to record a seller payment in the SellerPayment collection
    const sellerPayment = new SellerPayment({
      order: orderId,
      product: productId,
      paymentMethod,
      paymentStatus:"completed",
      amount,
      notes,
      seller: orderItem.product.seller._id, 
      processedBy: user
    });

    // Save the payment record
    await sellerPayment.save();

   
    await order.save();

    // Respond with success message and the saved payment details
    return response(res, 200, "Seller payment processed successfully", sellerPayment);
  } catch (error) {
    console.error("Error processing seller payment", error);
    return response(res, 500, "Something went wrong");
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Fetch all stats in parallel
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      statusCounts,
      recentOrders,
      revenueData,
      monthlySalesData
    ] = await Promise.all([
      // 1. Total Orders
      Order.countDocuments().lean(),

      // 2. Total Users
      User.countDocuments().lean(),

      // 3. Total Products
      Product.countDocuments().lean(),

      // 4. Order count by status
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),

      // 5. Recent Orders
      Order.find()
        .select("user totalAmount status createdAt")
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // 6. Total Revenue from completed payments
      Order.aggregate([
        {
          $match: { paymentStatus: "completed" }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" }
          }
        }
      ]),

      // 7. Monthly Sales
      Order.aggregate([
        {
          $match: { paymentStatus: "completed" }
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" }
            },
            total: { $sum: "$totalAmount" },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }
        }
      ])
    ]);

    // Get revenue value safely
    const revenue = revenueData[0]?.total || 0;

    // Process status counts
    const orderByStatus: Record<string, number> = {
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    statusCounts.forEach((item: any) => {
      const status = item._id;
      if (orderByStatus.hasOwnProperty(status)) {
        orderByStatus[status] = item.count;
      }
    });

    // Send final response
    return response(res, 200, "Dashboard stats fetched successfully", {
      count: {
        orders: totalOrders,
        users: totalUsers,
        products: totalProducts,
        revenue
      },
      orderByStatus,
      recentOrders,
      monthlySales: monthlySalesData
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return response(res, 500, "Something went wrong while fetching dashboard stats");
  }
};


export const getSellerPayment=async (req: Request, res: Response) => {
    try {
        const {sellerId,status,paymentMethod,startDate,endDate}=req.query;

        const query:any={};
        if(sellerId && sellerId !=="all"){
          query.status=status;
        }
        if(paymentMethod && paymentMethod !=="all"){
          query.status=status;
        }
        if (startDate && endDate) {
          query.createdAt = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string),
          };
        }
        const payments = await SellerPayment.find(query)
        .populate("seller","name email phoneNumber paymentDetails",)
        .populate("order")
        .populate("product","subject finalPrice images") 
        .populate("processedBy","name") 
        .sort({ createdAt: -1 }); 

        return response(res, 200, "Seller fetched processed successfully", payments);
    } catch (error) {
      console.error("failed to fetched seller payment:", error);
    return response(res, 500, "Something went wrong while fetching seller payment");
    }
}