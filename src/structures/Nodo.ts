export class Nodo<T> {
    public dato: T;
    public siguiente: Nodo<T> | null;

    constructor(dato: T) {
        this.dato = dato;
        this.siguiente = null;
    }
}