"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// @ts-ignore
const express_validator_1 = require("express-validator");
const AuthController = __importStar(require("./controllers/auth.controller.js"));
const EquipoController = __importStar(require("./controllers/equipo.controller.js"));
const validation_middleware_js_1 = require("./middlewares/validation.middleware.js");
const auth_middleware_js_1 = require("./middlewares/auth.middleware.js");
const role_middleware_js_1 = require("./middlewares/role.middleware.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
/*
  ENDPOINTS de AUTH
*/
// Login (público)
app.post("/api/auth/login", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email válido requerido"),
    (0, express_validator_1.body)("contraseña").isString().withMessage("Contraseña requerida")
], validation_middleware_js_1.validateRequest, AuthController.login);
// Register (solo admin)
app.post("/api/auth/register", auth_middleware_js_1.authMiddleware, (0, role_middleware_js_1.roleMiddleware)(["admin"]), [
    (0, express_validator_1.body)("nombre").isString().withMessage("Nombre requerido"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Email válido requerido"),
    (0, express_validator_1.body)("contraseña").isString().isLength({ min: 6 }).withMessage("Contraseña mínima 6 caracteres"),
    (0, express_validator_1.body)("rol").isIn(["admin", "user"]).withMessage("Rol inválido")
], validation_middleware_js_1.validateRequest, AuthController.register);
/*
  ENDPOINTS de EQUIPOS (prefijo /api/equipos)
  - Acceso: autenticado
  - List: admin => todos, user => solo suyos
  - Create: admin puede asignar, user crea solo para sí
  - Update: admin cualquiera, user solo suyo
  - Delete: admin solamente
*/
app.get("/api/equipos", auth_middleware_js_1.authMiddleware, EquipoController.listEquipos);
app.get("/api/equipos/:id", auth_middleware_js_1.authMiddleware, EquipoController.getEquipo);
app.post("/api/equipos", auth_middleware_js_1.authMiddleware, [
    (0, express_validator_1.body)("nombre").isString().withMessage("Nombre requerido"),
    (0, express_validator_1.body)("tipo").isString().withMessage("Tipo requerido"),
    (0, express_validator_1.body)("estado").isString().withMessage("Estado requerido"),
    (0, express_validator_1.body)("ubicacion").isString().withMessage("Ubicación requerida"),
    (0, express_validator_1.body)("serie").isString().withMessage("Serie requerida"),
    (0, express_validator_1.body)("responsableId").optional().isInt().withMessage("responsableId debe ser un número")
], validation_middleware_js_1.validateRequest, EquipoController.createEquipo);
app.put("/api/equipos/:id", auth_middleware_js_1.authMiddleware, [
    (0, express_validator_1.param)("id").isInt().withMessage("ID inválido"),
    (0, express_validator_1.body)("nombre").optional().isString(),
    (0, express_validator_1.body)("tipo").optional().isString(),
    (0, express_validator_1.body)("estado").optional().isString(),
    (0, express_validator_1.body)("ubicacion").optional().isString(),
    (0, express_validator_1.body)("serie").optional().isString(),
    (0, express_validator_1.body)("responsableId").optional().isInt()
], validation_middleware_js_1.validateRequest, EquipoController.updateEquipo);
// delete -> admin only
app.delete("/api/equipos/:id", auth_middleware_js_1.authMiddleware, (0, role_middleware_js_1.roleMiddleware)(["admin"]), EquipoController.deleteEquipo);
/* Error handler simple (por si alguna ruta lanza error sin manejar) */
app.use((err, req, res, next) => {
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
exports.default = app;
