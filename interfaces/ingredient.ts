export interface IIngredient {
    _id: string;
    nombre: string;
    unidadMedida: IUnit;
    categoria: IIngredientCategories;
    costoUnidad: number;
    inStock: number;
    minStock: number;
    slug: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export type IUnit = 'Kg'|'Lt'|'Gr'|'Unidad'|'Otro';
export type IIngredientCategories = 'bebida'|'lacteos'|'carne'|'panificados'|'vegetales'|'condimentos'|'otro';