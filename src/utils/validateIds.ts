import { AppError } from "./AppError.js";

/**
 * Validates:
 * 1. IDs exist in DB
 * 
 * NOTE:
 * - Duplicate validation is handled at Zod (request) layer
 */
export async function validateIds(
  ids: (string | number )[] | string,
  countFn: (ids: number[]) => Promise<number>,
  entityName: string
): Promise<number[]> {
  // Convert all values to numbers
  
  let parsedIds;
  if (typeof ids === "string") {
    parsedIds = JSON.parse(ids)
  } else {
    parsedIds = ids.map(Number);
  }



  // Defensive check (optional but safe)
  if (parsedIds.length === 0) {
    throw new AppError(
      `At least one ${entityName} ID is required`,
      400
    );
  }

  // Check existence in DB
  const count = await countFn(parsedIds);

  if (count !== parsedIds.length) {
    throw new AppError(
      `One or more ${entityName} IDs are invalid`,
      400
    );
  }

  return parsedIds;
}
