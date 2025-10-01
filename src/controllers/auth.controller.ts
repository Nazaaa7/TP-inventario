import { Request, Response } from "express";
import * as AuthService from "../services/auth.service.js";
import { success, failure } from "../helpers/response.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, contraseña } = req.body;
    const result = await AuthService.login(email, contraseña);
    return success(res, result, "Autenticación correcta", 200);
  } catch (err: any) {
    return failure(res, err.message || "Error en login", 400);
  }
};

// registro restringido a admin (middleware de roles lo debe controlar antes)
export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;
    const user = await AuthService.register({ nombre, email, contraseña, rol });
    return success(res, user, "Usuario creado", 201);
  } catch (err: any) {
    return failure(res, err.message || "Error en registro", 400);
  }
};
