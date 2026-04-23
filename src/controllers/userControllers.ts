import { UserService } from "../services/userServices.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response } from "express";
import { sendSuccessResponse } from "../utils/responseUtil.js";


const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  if (!userId) throw new AppError("user id not found in request", 500, false);
  const profile = await UserService.getUserProfile(userId);
  return sendSuccessResponse(
    req,
    res,
    "Profile fetched successfully",
    profile,
    200
  );
});
export { getUserProfile };
