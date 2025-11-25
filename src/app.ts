import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// @ts-ignore
import { body, param } from "express-validator";

import * as AuthController from "./controllers/auth.controller.js";
import * as EquipoController from "./controllers/equipo.controller.js";
import { validateRequest } from "./middlewares/validation.middleware.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { roleMiddleware } from "./middlewares/role.middleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/*
  ENDPOINTS de AUTH
*/
// Login (público)
app.post(
  "/api/auth/login",
  [
    body("email").isEmail().withMessage("Email válido requerido"),
    body("contraseña").isString().withMessage("Contraseña requerida")
  ],
  validateRequest,
  AuthController.login
);

// Register (solo admin)
app.post(
  "/api/auth/register",
  authMiddleware,
  roleMiddleware(["admin"]),
  [
    body("nombre").isString().withMessage("Nombre requerido"),
    body("email").isEmail().withMessage("Email válido requerido"),
    body("contraseña").isString().isLength({ min: 6 }).withMessage("Contraseña mínima 6 caracteres"),
    body("rol").isIn(["admin", "user"]).withMessage("Rol inválido")
  ],
  validateRequest,
  AuthController.register
);

/*
  ENDPOINTS de EQUIPOS (prefijo /api/equipos)
  - Acceso: autenticado
  - List: admin => todos, user => solo suyos
  - Create: admin puede asignar, user crea solo para sí
  - Update: admin cualquiera, user solo suyo
  - Delete: admin solamente
*/
app.get("/api/equipos", authMiddleware, EquipoController.listEquipos);
app.get("/api/equipos/:id", authMiddleware, EquipoController.getEquipo);

app.post(
  "/api/equipos",
  authMiddleware,
  [
    body("nombre").isString().withMessage("Nombre requerido"),
    body("tipo").isString().withMessage("Tipo requerido"),
    body("estado").isString().withMessage("Estado requerido"),
    body("ubicacion").isString().withMessage("Ubicación requerida"),
    body("serie").isString().withMessage("Serie requerida"),
    body("responsableId").optional().isInt().withMessage("responsableId debe ser un número")
  ],
  validateRequest,
  EquipoController.createEquipo
);

app.put(
  "/api/equipos/:id",
  authMiddleware,
  [
    param("id").isInt().withMessage("ID inválido"),
    body("nombre").optional().isString(),
    body("tipo").optional().isString(),
    body("estado").optional().isString(),
    body("ubicacion").optional().isString(),
    body("serie").optional().isString(),
    body("responsableId").optional().isInt()
  ],
  validateRequest,
  EquipoController.updateEquipo
);

// delete -> admin only
app.delete("/api/equipos/:id", authMiddleware, roleMiddleware(["admin"]), EquipoController.deleteEquipo);

/* Error handler simple (por si alguna ruta lanza error sin manejar) */
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  return res.status(500).json({ ok: false, message: "Error interno del servidor" });
});

/* Levantar servidor (si ejecutás este archivo directamente con ts-node-dev) */
if (process.env.NODE_ENV !== "test") {
  const PORT = Number(process.env.PORT ?? 4000);
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

export default app;
