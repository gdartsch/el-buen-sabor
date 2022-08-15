
export interface IProduct {
    _id: string;
    nombre: string;
    categoria: ICategories;
    imagen: string;
    precio: number;
    descripcion: string;
    estimatedTimeMinutes: number;
    recipe: [string, number][];
    slug: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IIngredientItem {
    ingrediente: string;
    cantidad: number;
}

export type ICategories = 'bebida'|'hamburguesa'|'pizza'|'pancho'|'guarnicion'|'lomo'|'otro';