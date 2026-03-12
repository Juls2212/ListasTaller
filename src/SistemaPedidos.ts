import {
    EstadoCotizacion,
    EstadoPago,
    EstadoPedido,
    EstadoRequisicion,
    RolUsuario
} from "./Tipos";
import { ListaEnlazada } from "./structures/ListaEnlazada";
import { Producto } from "./models/Producto";
import { Usuario } from "./models/Usuario";
import { Requisicion } from "./models/Requisicion";
import { Cotizacion } from "./models/Cotizacion";
import { Pedido } from "./models/Pedido";
import { Factura, Pago } from "./models/FacturaPago";
import { Historial } from "./models/Historial";

export class SistemaPedidos {
    private secuencia = 1;

    public requisiciones = new ListaEnlazada<Requisicion>();
    public cotizaciones = new ListaEnlazada<Cotizacion>();
    public pedidos = new ListaEnlazada<Pedido>();
    public facturas = new ListaEnlazada<Factura>();
    public pagos = new ListaEnlazada<Pago>();
    public historial = new ListaEnlazada<Historial>();

    private generarId(): number {
        return this.secuencia++;
    }

    private registrarHistorial(descripcion: string): void {
        this.historial.agregar(
            new Historial(this.generarId(), descripcion, new Date().toLocaleString())
        );
    }

    crearRequisicion(
        nombreProducto: string,
        precioUnitario: number,
        cantidad: number,
        nombreSolicitante: string,
        necesitaRevision: boolean
    ): Requisicion {
        const producto = new Producto(this.generarId(), nombreProducto, precioUnitario);
        const usuario = new Usuario(this.generarId(), nombreSolicitante, RolUsuario.BUYER);

        const requisicion = new Requisicion(
            this.generarId(),
            producto,
            cantidad,
            usuario,
            necesitaRevision,
            EstadoRequisicion.CREADA
        );

        this.requisiciones.agregar(requisicion);
        this.registrarHistorial(`Se creó la requisición ${requisicion.id}`);
        return requisicion;
    }

    prepararSolicitudCotizacion(idRequisicion: number): Requisicion | null {
        const requisicion = this.requisiciones.buscarPorId(idRequisicion);
        if (!requisicion) return null;

        requisicion.estado = requisicion.necesitaRevision
            ? EstadoRequisicion.EN_REVISION
            : EstadoRequisicion.SOLICITUD_PREPARADA;

        this.registrarHistorial(
            `La requisición ${requisicion.id} pasó a estado: ${requisicion.estado}`
        );

        return requisicion;
    }

    aprobarRequisicion(idRequisicion: number): Requisicion | null {
        const requisicion = this.requisiciones.buscarPorId(idRequisicion);
        if (!requisicion) return null;

        requisicion.estado = EstadoRequisicion.APROBADA;
        this.registrarHistorial(`La requisición ${requisicion.id} fue aprobada`);
        return requisicion;
    }

    crearCotizacion(idRequisicion: number, proveedor: string): Cotizacion | null {
        const requisicion = this.requisiciones.buscarPorId(idRequisicion);
        if (!requisicion) return null;

        const valorTotal = requisicion.producto.precioUnitario * requisicion.cantidad;

        const cotizacion = new Cotizacion(
            this.generarId(),
            requisicion,
            valorTotal,
            proveedor,
            EstadoCotizacion.EN_ANALISIS
        );

        this.cotizaciones.agregar(cotizacion);
        this.registrarHistorial(`Se creó la cotización ${cotizacion.id} para la requisición ${requisicion.id}`);
        return cotizacion;
    }

    aceptarCotizacion(idCotizacion: number): Cotizacion | null {
        const cotizacion = this.cotizaciones.buscarPorId(idCotizacion);
        if (!cotizacion) return null;

        cotizacion.estado = EstadoCotizacion.ACEPTADA;
        this.registrarHistorial(`La cotización ${cotizacion.id} fue aceptada`);
        return cotizacion;
    }

    prepararPedido(idCotizacion: number): Pedido | null {
        const cotizacion = this.cotizaciones.buscarPorId(idCotizacion);
        if (!cotizacion) return null;

        const pedido = new Pedido(this.generarId(), cotizacion, EstadoPedido.EN_REVISION);
        this.pedidos.agregar(pedido);
        this.registrarHistorial(`Se preparó el pedido ${pedido.id} a partir de la cotización ${cotizacion.id}`);
        return pedido;
    }

    aceptarPedido(idPedido: number): Pedido | null {
        const pedido = this.pedidos.buscarPorId(idPedido);
        if (!pedido) return null;

        pedido.estado = EstadoPedido.ACEPTADO;
        this.registrarHistorial(`El pedido ${pedido.id} fue aceptado`);
        return pedido;
    }

    cumplirPedido(idPedido: number): Pedido | null {
        const pedido = this.pedidos.buscarPorId(idPedido);
        if (!pedido) return null;

        pedido.estado = EstadoPedido.COMPLETADO;
        this.registrarHistorial(`El pedido ${pedido.id} fue cumplido`);
        return pedido;
    }

    generarFactura(idPedido: number): Factura | null {
        const pedido = this.pedidos.buscarPorId(idPedido);
        if (!pedido) return null;

        const total = pedido.cotizacion.valorTotal;
        const factura = new Factura(this.generarId(), pedido, total);
        this.facturas.agregar(factura);

        this.registrarHistorial(`Se generó la factura ${factura.id} del pedido ${pedido.id}`);
        return factura;
    }

    registrarPago(idFactura: number): Pago | null {
        const factura = this.facturas.buscarPorId(idFactura);
        if (!factura) return null;

        const pago = new Pago(this.generarId(), factura, EstadoPago.PAGADO);
        this.pagos.agregar(pago);

        this.registrarHistorial(`Se registró el pago de la factura ${factura.id}`);
        return pago;
    }

    obtenerResumen() {
        return {
            requisiciones: this.requisiciones.toArray(),
            cotizaciones: this.cotizaciones.toArray(),
            pedidos: this.pedidos.toArray(),
            facturas: this.facturas.toArray(),
            pagos: this.pagos.toArray(),
            historial: this.historial.toArray()
        };
    }
}