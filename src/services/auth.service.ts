import prisma from "../config/prisma.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

type RegisterDto = { nombre: string; email: string; contraseña: string; rol: "admin" | "user" };

export const register = async (data: RegisterDto) => {
  const exists = await prisma.usuario.findUnique({ where: { email: data.email } });
  if (exists) throw new Error("Email ya registrado");

  const hashed = await hashPassword(data.contraseña);
  const user = await prisma.usuario.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      contraseña: hashed,
      rol: data.rol
    }
  });
  // No devolvemos la contraseña
  // @ts-ignore
  delete user.contraseña;
  return user;
};

export const login = async (email: string, contraseña: string) => {
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) throw new Error("Usuario no encontrado");

  const match = await comparePassword(contraseña, (user as any)["contraseña"]);
  if (!match) throw new Error("Credenciales inválidas");

  const token = generateToken({ id: user.id, rol: user.rol });
  return { token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } };
};
