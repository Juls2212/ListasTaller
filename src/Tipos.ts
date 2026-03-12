export enum RolUsuario {
    SHIPPING = "Shipping Office",
    BUYER = "Buyer Agent",
    SUPERVISOR = "Supervisor",
    SELLER = "Seller",
    RECEIVER = "Receive Agent"
}

export enum EstadoRequisicion {
    CREADA = "Creada",
    SOLICITUD_PREPARADA = "Solicitud preparada",
    EN_REVISION = "En revisión",
    APROBADA = "Aprobada",
    RECHAZADA = "Rechazada"
}

export enum EstadoCotizacion {
    PENDIENTE = "Pendiente",
    EN_ANALISIS = "En análisis",
    ACEPTADA = "Aceptada",
    RECHAZADA = "Rechazada",
    REVISADA = "Revisada"
}

export enum EstadoPedido {
    PREPARADO = "Preparado",
    EN_REVISION = "En revisión",
    ACEPTADO = "Aceptado",
    EN_PROCESO = "En proceso",
    COMPLETADO = "Completado"
}

export enum EstadoPago {
    PENDIENTE = "Pendiente",
    PAGADO = "Pagado"
}