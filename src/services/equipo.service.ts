import prisma from "../config/prisma.js";
import { Equipo } from "../models/equipo.model.js";

export const listAll = async () => {
  return prisma.equipo.findMany({ include: { responsable: { select: { id: true, nombre: true, email: true, rol: true } } } });
};

export const listByUser = async (userId: number) => {
  return prisma.equipo.findMany({
    where: { responsableId: userId },
    include: { responsable: { select: { id: true, nombre: true, email: true } } }
  });
};

export const getById = async (id: number) => {
  return prisma.equipo.findUnique({
    where: { id },
    include: { responsable: true }
  });
};

export const createEquipo = async (data: Partial<Equipo>) => {
  // Prisma lanzará error si serie ya existe (constraint unique)
  return prisma.equipo.create({
    data: {
      nombre: data.nombre!,
      tipo: data.tipo!,
      estado: data.estado!,
      ubicacion: data.ubicacion!,
      serie: data.serie!,
      observaciones: data.observaciones ?? null,
      fechaAsignacion: data.fechaAsignacion ?? undefined,
      responsableId: data.responsableId!
    }
  });
};

export const updateEquipo = async (id: number, data: Partial<Equipo>) => {
  return prisma.equipo.update({
    where: { id },
    data: {
      nombre: data.nombre,
      tipo: data.tipo,
      estado: data.estado,
      ubicacion: data.ubicacion,
      serie: data.serie,
      observaciones: data.observaciones,
      responsableId: data.responsableId
    }
  });
};

export const deleteEquipo = async (id: number) => {
  return prisma.equipo.delete({ where: { id } });
};
