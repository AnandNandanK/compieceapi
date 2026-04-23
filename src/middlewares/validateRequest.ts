import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { deleteFile } from "./uploads.js";

export const validateRequest =
  (schema: ZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      console.log("BODY DATA.......",req.body);
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        if (req.file) deleteFile(req.file.path);

        if(req.file){
          deleteFile(req.file.path);
        }

        if(req.file){
          deleteFile(req.file.path);
        }

        return next(new AppError("Validation failed", 400, true, errors));
      }

      next(error);
    }
  };
