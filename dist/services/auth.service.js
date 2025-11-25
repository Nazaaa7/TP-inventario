"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
const bcrypt_helper_js_1 = require("../helpers/bcrypt.helper.js");
const jwt_helper_js_1 = require("../helpers/jwt.helper.js");
const register = async (data) => {
    const exists = await prisma_js_1.default.usuario.findUnique({ where: { email: data.email } });
    if (exists)
        throw new Error("Email ya registrado");
    const hashed = await (0, bcrypt_helper_js_1.hashPassword)(data.contraseña);
    const user = await prisma_js_1.default.usuario.create({
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
exports.register = register;
const login = async (email, contraseña) => {
    const user = await prisma_js_1.default.usuario.findUnique({ where: { email } });
    if (!user)
        throw new Error("Usuario no encontrado");
    const match = await (0, bcrypt_helper_js_1.comparePassword)(contraseña, user["contraseña"]);
    if (!match)
        throw new Error("Credenciales inválidas");
    const token = (0, jwt_helper_js_1.generateToken)({ id: user.id, rol: user.rol });
    return { token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } };
};
exports.login = login;
