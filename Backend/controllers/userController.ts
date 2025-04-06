import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import User from "../models/User";

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;


    if (!userId) {
      return response(
        res,
        400,
        "user with this id not found check the userId please"
      );
    }

    const { name, email, phoneNumber } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phoneNumber },
      { new: true,runValidators:true }
    ).select(
        "-password -verificationToken -restPasswordToken -resetPasswordExpires"
      );;

    if (!updatedUser) {
      return response(res, 404, "User Not Found");
    }

    return response(res, 200, "User Profile Update SuccessFully", updatedUser);
  } catch (error) {
    return response(res, 500, "Something went wrong", error);
  }
};
