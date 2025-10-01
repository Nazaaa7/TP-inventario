export interface Equipo {
  id: number;
  nombre: string;
  tipo: string;
  estado: string;
  ubicacion: string;
  serie: string;
  observaciones?: string;
  fechaAsignacion: Date;
  responsableId: number;
}
