import { EstadoPedido } from "../Tipos";
import { Cotizacion } from "./Cotizacion";

export class Pedido {
    constructor(
        public id: number,
        public cotizacion: Cotizacion,
        public estado: EstadoPedido = EstadoPedido.PREPARADO
    ) {}
}