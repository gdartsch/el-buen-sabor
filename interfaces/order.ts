import { IIngredientItem, IUser } from "./";

export interface IOrder {
    [x: string]: any;
    _id?: string;
    user?: IUser | string;
    orderItems: IOrderItem[];
    sendAddress: SendAddress;
    paymentResult?: string;
    numberOfItems: number;
    subTotal: number;
    tax: number;
    discount: number;
    total: number;
    currentState: IOrderState;
    paidMethod: IPaymentMethod;
    estimatedTime: number;
    isPaid: boolean;
    paidAt?: string;
    transactionId?: string;

    createdAt?: string;
}

export type IOrderState = 'Ingresado'|'En Cocina'|'En delivery'|'Entregado'|'Cancelado';

export type IPaymentMethod = 'MercadoPago'|'Efectivo';

export interface IOrderItem {
    _id: string;
    nombre: string;
    maximo: number;
    cantidad: number;
    estimatedTimeMinutes: number;
    slug: string;
    imagen: string;
    precio: number;
}

export interface SendAddress {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    cp: string;
    department: string;
    phone: string;
}