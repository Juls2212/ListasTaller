import { SistemaPedidos } from "../SistemaPedidos";

const sistema = new SistemaPedidos();

function ultimoId<T extends { id: number }>(lista: T[]): number | null {
    if (lista.length === 0) return null;
    return lista[lista.length - 1].id;
}

function renderStats(): void {
    const stats = document.getElementById("stats");
    if (!stats) return;

    const data = sistema.obtenerResumen();

    stats.innerHTML = `
        <div class="stat"><span>Requisiciones</span><strong>${data.requisiciones.length}</strong></div>
        <div class="stat"><span>Cotizaciones</span><strong>${data.cotizaciones.length}</strong></div>
        <div class="stat"><span>Pedidos</span><strong>${data.pedidos.length}</strong></div>
        <div class="stat"><span>Facturas</span><strong>${data.facturas.length}</strong></div>
        <div class="stat"><span>Pagos</span><strong>${data.pagos.length}</strong></div>
    `;
}

function renderLista(
    contenedorId: string,
    lista: string
): void {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    contenedor.innerHTML = lista || `<p class="empty">Sin registros todavía.</p>`;
}

function render(): void {
    const data = sistema.obtenerResumen();

    renderStats();

    renderLista(
        "requisiciones",
        data.requisiciones.map(req => `
            <div class="item">
                <p><strong>ID:</strong> ${req.id}</p>
                <p><strong>Producto:</strong> ${req.producto.nombre}</p>
                <p><strong>Cantidad:</strong> ${req.cantidad}</p>
                <p><strong>Solicitante:</strong> ${req.solicitante.nombre}</p>
                <p><span class="tag">${req.estado}</span></p>
            </div>
        `).join("")
    );

    renderLista(
        "cotizaciones",
        data.cotizaciones.map(cot => `
            <div class="item">
                <p><strong>ID:</strong> ${cot.id}</p>
                <p><strong>Proveedor:</strong> ${cot.proveedor}</p>
                <p><strong>Valor total:</strong> ${cot.valorTotal}</p>
                <p><strong>Requisición:</strong> ${cot.requisicion.id}</p>
                <p><span class="tag">${cot.estado}</span></p>
            </div>
        `).join("")
    );

    renderLista(
        "pedidos",
        data.pedidos.map(ped => `
            <div class="item">
                <p><strong>ID:</strong> ${ped.id}</p>
                <p><strong>Cotización:</strong> ${ped.cotizacion.id}</p>
                <p><span class="tag">${ped.estado}</span></p>
            </div>
        `).join("")
    );

    renderLista(
        "facturasPagos",
        `
        <div class="item-list">
            ${data.facturas.map(fac => `
                <div class="item">
                    <p><strong>Factura:</strong> ${fac.id}</p>
                    <p><strong>Pedido:</strong> ${fac.pedido.id}</p>
                    <p><strong>Total:</strong> ${fac.total}</p>
                </div>
            `).join("")}
            ${data.pagos.map(pag => `
                <div class="item">
                    <p><strong>Pago:</strong> ${pag.id}</p>
                    <p><strong>Factura:</strong> ${pag.factura.id}</p>
                    <p><span class="tag">${pag.estado}</span></p>
                </div>
            `).join("")}
        </div>
        `
    );

    const historial = document.getElementById("historial");
    if (historial) {
        historial.innerHTML = data.historial.length === 0
            ? `<p class="empty">Aún no hay movimientos registrados.</p>`
            : data.historial.map(h => `
                <div class="history-entry">
                    <strong>${h.descripcion}</strong>
                    <p>${h.fecha}</p>
                </div>
            `).join("");
    }
}

function mostrarMensaje(texto: string): void {
    alert(texto);
}

function configurarFormulario(): void {
    const form = document.getElementById("formRequisicion") as HTMLFormElement | null;
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const producto = (document.getElementById("producto") as HTMLInputElement).value.trim();
        const precio = Number((document.getElementById("precio") as HTMLInputElement).value);
        const cantidad = Number((document.getElementById("cantidad") as HTMLInputElement).value);
        const solicitante = (document.getElementById("solicitante") as HTMLInputElement).value.trim();
        const revision = (document.getElementById("revision") as HTMLInputElement).checked;

        if (!producto || !precio || !cantidad || !solicitante) {
            mostrarMensaje("Completa todos los campos de la requisición.");
            return;
        }

        sistema.crearRequisicion(producto, precio, cantidad, solicitante, revision);
        form.reset();
        render();
    });
}

function configurarBotones(): void {
    document.getElementById("btnPrepararSolicitud")?.addEventListener("click", () => {
        const id = ultimoId(sistema.obtenerResumen().requisiciones);
        if (id === null) return mostrarMensaje("Primero crea una requisición.");
        sistema.prepararSolicitudCotizacion(id);
        render();
    });

    document.getElementById("btnAprobarReq")?.addEventListener("click", () => {
        const id = ultimoId(sistema.obtenerResumen().requisiciones);
        if (id === null) return mostrarMensaje("No hay requisiciones para aprobar.");
        sistema.aprobarRequisicion(id);
        render();
    });

    document.getElementById("btnCrearCotizacion")?.addEventListener("click", () => {
        const id = ultimoId(sistema.obtenerResumen().requisiciones);
        if (id === null) return mostrarMensaje("Primero crea o prepara una requisición.");
        sistema.crearCotizacion(id, "Proveedor ABC");
        render();
    });

    document.getElementById("btnAceptarCotizacion")?.addEventListener("click", () => {
        const id = ultimoId(sistema.obtenerResumen().cotizaciones);
        if (id === null) return mostrarMensaje("No hay cotizaciones para aceptar.");
        sistema.aceptarCotizacion(id);
        render();
    });

    document.getElementById("btnPrepararPedido")?.addEventListener("click", () => {
        const id = ultimoId(sistema.obtenerResumen().cotizaciones);
        if (id === null) return mostrarMensaje("Primero crea una cotización.");
        sistema.prepararPedido(id);
        render();
    });

    document.getElementById("btnAceptarPedido")?.addEventListener("click", () => {
        const id = ultimoId(sistema.obtenerResumen().pedidos);
        if (id === null) return mostrarMensaje("No hay pedidos para aceptar.");
        sistema.aceptarPedido(id);
        render();
    });

    document.getElementById("btnCumplirPedido")?.addEventListener("click", () => {
        const id = ultimoId(sistema.obtenerResumen().pedidos);
        if (id === null) return mostrarMensaje("No hay pedidos para completar.");
        sistema.cumplirPedido(id);
        render();
    });

    document.getElementById("btnGenerarFactura")?.addEventListener("click", () => {
        const id = ultimoId(sistema.obtenerResumen().pedidos);
        if (id === null) return mostrarMensaje("No hay pedidos para facturar.");
        sistema.generarFactura(id);
        render();
    });

    document.getElementById("btnRegistrarPago")?.addEventListener("click", () => {
        const id = ultimoId(sistema.obtenerResumen().facturas);
        if (id === null) return mostrarMensaje("No hay facturas para pagar.");
        sistema.registrarPago(id);
        render();
    });
}

export function iniciarApp(): void {
    configurarFormulario();
    configurarBotones();
    render();
}