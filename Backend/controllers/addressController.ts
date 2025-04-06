import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import User from "../models/User";

export const createOrUpdateAddressByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const {
      addressLine1,
      addressLine2,
      phoneNumber,
      city,
      state,
      pincode,
      addressId,
    } = req.body;

    if (!userId) {
      return response(res, 400, "User not found, please provide a valid user ID");
    }

    // Check for required fields
    if (!addressLine1 || !phoneNumber || !city || !state || !pincode) {
      return response(res, 400, "Please enter all required values");
    }

    //  Update existing address
    if (addressId) {
      const existingAddress = await Address.findById(addressId);

      if (!existingAddress) {
        return response(res, 404, "Address not found");
      }

      existingAddress.addressLine1 = addressLine1;
      existingAddress.addressLine2 = addressLine2;
      existingAddress.phoneNumber = phoneNumber;
      existingAddress.city = city;
      existingAddress.state = state;
      existingAddress.pincode = pincode;

      await existingAddress.save();

      return response(res, 200, "Address updated successfully", existingAddress);
    }

    //  Create new address
    const newAddress = new Address({
      user: userId,
      addressLine1,
      addressLine2,
      phoneNumber,
      city,
      state,
      pincode,
    });

    await newAddress.save();


    await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: newAddress._id } }, 
      { new: true }
    );

    return response(res, 201, "Address created successfully", newAddress);
  } catch (error) {
    return response(res, 500, "Something went wrong", error);
  }
};


export const getAddressByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.id;
  
      if (!userId) {
        return response(res, 400, "User not found, please provide a proper user ID");
      }
  
      const userWithAddress = await User.findById(userId).populate({
        path: "addresses", 
      });
  
      if (!userWithAddress) {
        return response(res, 404, "User not found");
      }
  
      return response(res, 200, "Address fetched successfully", userWithAddress.addresses);
    } catch (error) {
      return response(res, 500, "Something went wrong", error);
    }
  };
  