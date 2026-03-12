import { EstadoCotizacion } from "../Tipos";
import { Requisicion } from "./Requisicion";

export class Cotizacion {
    constructor(
        public id: number,
        public requisicion: Requisicion,
        public valorTotal: number,
        public proveedor: string,
        public estado: EstadoCotizacion = EstadoCotizacion.PENDIENTE
    ) {}
}