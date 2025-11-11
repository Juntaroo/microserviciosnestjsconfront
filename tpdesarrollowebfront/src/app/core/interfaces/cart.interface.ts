export interface Carrito {
    id?: number,
    idUser?: number,
    idProduct: number,
    quantity: number,
    totalPrice?: number,
    bought?: boolean
}