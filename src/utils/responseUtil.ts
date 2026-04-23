import { Response, Request } from "express";

import { request } from "http";

export type ApiResponse<T = any> = {
  traceId: string;
  statusCode: number;
  status: "SUCCESS" | "FAILURE";
  timestamp: string;
  message: string;
  data?: T;
  error?: any;
};


// 🔹 Success Response
export const sendSuccessResponse = <T>(
  req: Request,
  res: Response,
  message: string,
  data?: T,
  statusCode = 200 
) => {
  
  const response: ApiResponse<T> = {
    traceId: req.correlationId,
    statusCode,
    status: "SUCCESS",
    timestamp: new Date().toISOString(),
    message,
    data,
  };
 

  return res.status(statusCode).json(response);
};



// 🔹 Error Response
export const sendErrorResponse = (
   req: Request,
  res: Response,
  message: string,
  error: any = undefined,
  statusCode = 500,
) => {

  const response: ApiResponse = {
    traceId: req.correlationId,
    statusCode,
    status: "FAILURE",
    timestamp: new Date().toISOString(),
    message,
    error,
  };
  
  return res.status(statusCode).json(response);
};
