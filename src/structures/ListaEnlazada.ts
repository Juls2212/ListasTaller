import { Nodo } from "./Nodo";

export class ListaEnlazada<T extends { id: number }> {
    private cabeza: Nodo<T> | null;

    constructor() {
        this.cabeza = null;
    }

    agregar(dato: T): void {
        const nuevo = new Nodo(dato);

        if (!this.cabeza) {
            this.cabeza = nuevo;
            return;
        }

        let actual = this.cabeza;
        while (actual.siguiente) {
            actual = actual.siguiente;
        }

        actual.siguiente = nuevo;
    }

    buscarPorId(id: number): T | null {
        let actual = this.cabeza;

        while (actual) {
            if (actual.dato.id === id) {
                return actual.dato;
            }
            actual = actual.siguiente;
        }

        return null;
    }

    recorrer(callback: (dato: T) => void): void {
        let actual = this.cabeza;

        while (actual) {
            callback(actual.dato);
            actual = actual.siguiente;
        }
    }

    toArray(): T[] {
        const elementos: T[] = [];
        this.recorrer((dato) => elementos.push(dato));
        return elementos;
    }
}