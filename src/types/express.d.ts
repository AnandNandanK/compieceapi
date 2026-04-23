import "express";
import { UserRole } from "../prismaClient/enums.js";

declare module "express-serve-static-core" {
  interface Request {
    tempUser?: {
      userId: number;
    };
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: number;
      role:UserRole
    };
  }
}
declare module "express-serve-static-core" {
  interface Request {
    resetUser?: {
      userId: number;
      role:UserRole
    };
  }
}
