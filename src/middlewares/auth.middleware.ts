import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/jwt.helper.js";
import { failure } from "../helpers/response.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return failure(res, "No se proporcionó token", 401);

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return failure(res, "Formato de token inválido", 401);

    const token = parts[1];
    const decoded = verifyToken(token);
    // decoded tiene: { id, rol }
    req.user = { id: (decoded as any).id, rol: (decoded as any).rol };
    next();
  } catch (err) {
    return failure(res, "Token inválido o expirado", 401);
  }
};
