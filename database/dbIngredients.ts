import { db } from '.';
import { Ingredient } from '../models';
import { IIngredient } from '../interfaces';

export const getIngredientsByName =async (name: string): Promise<IIngredient[]> => {
    
    await db.connect();

    name = name.toString().toLowerCase();

    await db.connect();

    const ingredients = await Ingredient.find({ 
        $text: { $search: name }
    })
    .select('nombre unidadMedida categoria costoUnidad inStock minStock active slug -_id')
    .lean();

    await db.disconnect();

    return ingredients;
}

export const getAllIngredients =async (): Promise<IIngredient[]> => {
    
    await db.connect();

    const ingredients = await Ingredient.find()
    .select('nombre unidadMedida categoria costoUnidad inStock minStock active slug -_id')
    .lean();

    await db.disconnect();

    return ingredients;
}

export const getIngredientBySlug =async (slug: string): Promise<IIngredient | null> => {
    
    await db.connect();

    const ingredient = await Ingredient.findOne({ slug }).lean(); 

    await db.disconnect();

    if (!ingredient) {
        return null;
    }

    return JSON.parse(JSON.stringify(ingredient));
}