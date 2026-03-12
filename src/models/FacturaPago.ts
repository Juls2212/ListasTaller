import { EstadoPago } from "../Tipos";
import { Pedido } from "./Pedido";

export class Factura {
    constructor(
        public id: number,
        public pedido: Pedido,
        public total: number
    ) {}
}

export class Pago {
    constructor(
        public id: number,
        public factura: Factura,
        public estado: EstadoPago = EstadoPago.PENDIENTE
    ) {}
}