import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    export interface UserPayload extends JwtPayload {
      id: number;
      rol: "admin" | "user"; // o los roles que tengas definidos
    }

    export interface Request {
      user?: UserPayload;
    }
  }
}
