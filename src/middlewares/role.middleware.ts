import { Request, Response, NextFunction } from "express";
import { failure } from "../helpers/response.js";

export const roleMiddleware = (allowedRoles: ("admin" | "user")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return failure(res, "No autorizado", 401);
    if (!allowedRoles.includes(user.rol as "admin" | "user")) return failure(res, "Acceso prohibido", 403);
    next();
  };
};
