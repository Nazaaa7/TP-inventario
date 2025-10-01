import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const generateToken = (payload: { id: number; rol: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { id: number; rol: string; iat?: number; exp?: number };
};
