import { IIngredientItem } from ".";

export interface ICartProduct {
    _id: string;
    nombre: string;
    imagen: string;
    precio: number;
    recipe: [string, number][];
    estimatedTimeMinutes: number;
    slug: string;
    maximo: number;
    cantidad: number;
}