// import { Request, Response } from "express";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { AppError } from "../utils/AppError.js";
// import { sendSuccessResponse } from "../utils/responseUtil.js";
// import EnquiryService from "../services/enquiryServices.js";
// import { EnquiryType } from "../prismaClient/enums.js";
// import { sendEnquiryNotification } from "../utils/emailUtils/sendEnquiryEmail.js";

// // CREATE ENQUIRY

// export const createEnquiry = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { packageId, userId, hotelId, type, name, email, phone, message } =
//       req.body;

//     if (!name) throw new AppError("Name is required", 400);
//     if (!email) throw new AppError("Email is required", 400);
//     if (!phone) throw new AppError("Phone number is required", 400);

//     let finaltype: EnquiryType = "UNKNOWN";
//     if (type === "PACKAGE" || type === "HOTEL") {
//       finaltype = type;
//     }

//     const enquiry = await EnquiryService.createEnquiry({
//       userId,
//       packageId: finaltype === "PACKAGE" ? packageId : undefined,
//       hotelId: finaltype === "HOTEL" ? hotelId : undefined,
//       type: finaltype,
//       name,
//       email,
//       phone,
//       message,
//     });

//     sendSuccessResponse(req, res, "Enquiry created successfully", enquiry, 201);
//     // -------------- EMAIL NOTIFICATION --------------
//     const adminEmails = process.env.NOTIFICATION_EMAILS?.split(",") || [];

//     if (adminEmails.length > 0) {
//       await sendEnquiryNotification(adminEmails, {
//         name,
//         email,
//         phone,
//         message,
//         type: finaltype,
//       });
//     }
//     // -------------------------------------------------
//   }
// );


// // GET ALL ENQUIRIES
// export const getAllEnquiries = asyncHandler(
//   async (req: Request, res: Response) => {
//     const page = req.query.page ? Number(req.query.page) : 1;
//     const limit = req.query.limit ? Number(req.query.limit) : 10;
//     const skip = (page - 1) * limit;

//     const enquiries = await EnquiryService.getAllEnquiries(skip, limit);

//     return sendSuccessResponse(
//       req,
//       res,
//       "Enquiries fetched successfully",
//       enquiries,
//       200
//     );
//   }
// );


// // FILTER ENQUIRIES
// export const filterEnquiries = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { type, status, tourId, hotelId, userId } = req.body;

//     const page = req.query.page ? Number(req.query.page) : 1;
//     const limit = req.query.limit ? Number(req.query.limit) : 10;
//     const skip = (page - 1) * limit;

//     const filters: any = {};
//     if (type) filters.type = type;
//     if (status) filters.status = status;
//     if (tourId) filters.tourId = Number(tourId);
//     if (hotelId) filters.hotelId = Number(hotelId);
//     if (userId) filters.userId = Number(userId);

//     const enquiries = await EnquiryService.filterEnquiries(
//       skip,
//       limit,
//       filters
//     );

//     return sendSuccessResponse(
//       req,
//       res,
//       "Filtered enquiries fetched",
//       enquiries,
//       200
//     );
//   }
// );


// // GET USER ENQUIRIES (Only enquiries that have a userId)
// export const getUserEnquiries = asyncHandler(
//   async (req: Request, res: Response) => {
//     const page = req.query.page ? Number(req.query.page) : 1;
//     const limit = req.query.limit ? Number(req.query.limit) : 10;
//     const skip = (page - 1) * limit;

//     const type = req.query.type as "hotel" | "package" | undefined;
//     const search=req.query.search;

//     // console.log("SEARCH.....",search)

//     // console.log('TYPE....',type);

//     const enquiries = await EnquiryService.getUserEnquiries(skip, limit, type, search);

//     return sendSuccessResponse(
//       req,
//       res,
//       "User enquiries fetched successfully",
//       enquiries,
//       200
//     );
//   }
// );


// // GET UNKNOWN ENQUIRIES (userId is null)
// export const getUnknownEnquiries = asyncHandler(
//   async (req: Request, res: Response) => {
//     const page = req.query.page ? Number(req.query.page) : 1;
//     const limit = req.query.limit ? Number(req.query.limit) : 10;
//      const search=req.query.search;
//     const skip = (page - 1) * limit;
//     const enquiries = await EnquiryService.getUnknownEnquiries(skip, limit,search);

//     return sendSuccessResponse(
//       req,
//       res,
//       "Unknown enquiries fetched successfully",
//       enquiries,
//       200
//     );
//   }
// );


// // UPDATE ENQUIRY STATUS USING QUERY PARAMS
// export const updateEnquiryStatusByQuery = asyncHandler(
//   async (req: Request, res: Response) => {
//     const enquiryId = req.query.enquiryId ? Number(req.query.enquiryId) : null;

//     const status = req.query.status as
//       | "PENDING"
//       | "BOOKED"
//       | "CLOSED"
//       | "IN_PROGRESS"
//       | null;

//     // Validation
//     if (!enquiryId) {
//       throw new AppError("enquiryId is required in query params", 400);
//     }

//     if (!status) {
//       throw new AppError("status is required in query params", 400);
//     }

//     // Update call
//     const updatedEnquiry = await EnquiryService.updateEnquiryStatus(
//       enquiryId,
//       status
//     );

//     return sendSuccessResponse(
//       req,
//       res,
//       "Enquiry status updated successfully",
//       updatedEnquiry,
//       200
//     );
//   }
// );
