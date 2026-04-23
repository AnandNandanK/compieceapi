
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: any;

  
  constructor(message: string, statusCode: number = 500,isOperational=true, details?: any) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.statusCode = statusCode;
    this.isOperational = isOperational; // custom errors we throw are operational
    this.details = details;

  
    Error.captureStackTrace(this, this.constructor);
  }
}
