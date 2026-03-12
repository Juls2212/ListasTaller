import { RolUsuario } from "../Tipos";

export class Usuario {
    constructor(
        public id: number,
        public nombre: string,
        public rol: RolUsuario
    ) {}
}