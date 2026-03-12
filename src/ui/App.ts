import { SistemaPedidos } from "../SistemaPedidos";

const sistema = new SistemaPedidos();

function render(): void {
    const salida = document.getElementById("salida");
    if (!salida) return;

    const datos = sistema.obtenerResumen();

    salida.innerHTML = `
        <h2>Requisiciones</h2>
        <pre>${JSON.stringify(datos.requisiciones, null, 2)}</pre>

        <h2>Cotizaciones</h2>
        <pre>${JSON.stringify(datos.cotizaciones, null, 2)}</pre>

        <h2>Pedidos</h2>
        <pre>${JSON.stringify(datos.pedidos, null, 2)}</pre>

        <h2>Facturas</h2>
        <pre>${JSON.stringify(datos.facturas, null, 2)}</pre>

        <h2>Pagos</h2>
        <pre>${JSON.stringify(datos.pagos, null, 2)}</pre>

        <h2>Historial</h2>
        <pre>${JSON.stringify(datos.historial, null, 2)}</pre>
    `;
}

function configurarEventos(): void {
    const btnCrear = document.getElementById("btnCrear");
    const btnCotizar = document.getElementById("btnCotizar");
    const btnPedido = document.getElementById("btnPedido");
    const btnFactura = document.getElementById("btnFactura");
    const btnPago = document.getElementById("btnPago");

    btnCrear?.addEventListener("click", () => {
        const req = sistema.crearRequisicion("Laptop", 2500, 2, "Carlos", true);
        sistema.prepararSolicitudCotizacion(req.id);
        sistema.aprobarRequisicion(req.id);
        render();
    });

    btnCotizar?.addEventListener("click", () => {
        const requisiciones = sistema.obtenerResumen().requisiciones;
        if (requisiciones.length > 0) {
            const cot = sistema.crearCotizacion(requisiciones[0].id, "Proveedor ABC");
            if (cot) {
                sistema.aceptarCotizacion(cot.id);
            }
        }
        render();
    });

    btnPedido?.addEventListener("click", () => {
        const cotizaciones = sistema.obtenerResumen().cotizaciones;
        if (cotizaciones.length > 0) {
            const pedido = sistema.prepararPedido(cotizaciones[0].id);
            if (pedido) {
                sistema.aceptarPedido(pedido.id);
                sistema.cumplirPedido(pedido.id);
            }
        }
        render();
    });

    btnFactura?.addEventListener("click", () => {
        const pedidos = sistema.obtenerResumen().pedidos;
        if (pedidos.length > 0) {
            sistema.generarFactura(pedidos[0].id);
        }
        render();
    });

    btnPago?.addEventListener("click", () => {
        const facturas = sistema.obtenerResumen().facturas;
        if (facturas.length > 0) {
            sistema.registrarPago(facturas[0].id);
        }
        render();
    });
}

export function iniciarApp(): void {
    configurarEventos();
    render();
}