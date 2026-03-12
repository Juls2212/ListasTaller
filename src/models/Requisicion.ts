import { EstadoRequisicion } from "../Tipos";
import { Producto } from "./Producto";
import { Usuario } from "./Usuario";

export class Requisicion {
    constructor(
        public id: number,
        public producto: Producto,
        public cantidad: number,
        public solicitante: Usuario,
        public necesitaRevision: boolean,
        public estado: EstadoRequisicion = EstadoRequisicion.CREADA
    ) {}
}