import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { failure } from "../helpers/response.js";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return failure(res, "Errores de validación", 400, { errors: errors.array() });
  }
  next();
};
