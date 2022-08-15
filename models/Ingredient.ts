import mongoose, { Schema, model, Model} from "mongoose";
import { IIngredient } from "../interfaces";

const ingredientSchema: Schema = new Schema({
    nombre: { type: String, required: true, default: '' },
    unidadMedida: [{
        type: String,
        enum: ['Kg', 'Lt', 'Gr', 'Unidad', 'Otro'],
        message: 'La unidad de medida debe ser una de las siguientes: Kg, Lt, Gr, Unidad, Otro',
        default: 'bebida'
    }],
    categoria: [{
        type: String,
        enum: ['bebida', 'lacteos', 'carne', 'panificados', 'vegetales', 'condimentos', 'otro'],
        message: 'La categoria debe ser una de las siguientes: bebida, lacteos, carne, panificados, vegetales, condimentos, otro',
        default: 'bebida'
    }],
    costoUnidad: { type: Number, required: true, default: 0 },
    inStock: { type: Number, required: true, default: 0 },
    minStock: { type: Number, required: true, default: 0 },
    slug: { type: String, required: true, unique: true },
    active: { type: Boolean, required: true, default: true },
}, { 
    timestamps: true 
});

ingredientSchema.index({ nombre: 'text', tags: 'text' });

const Ingredient: Model<IIngredient> = mongoose.models.Ingredient || model('Ingredient', ingredientSchema);

export default Ingredient;
