import { Request, Response, NextFunction } from "express";

export type AsyncFunction<T = any> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;

export const asyncHandler = <T = any>(fn: AsyncFunction<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
