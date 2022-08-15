import mongoose, { Schema, model, Model} from "mongoose";
import { IIngredientItem } from "../interfaces";

const ingredientItemSchema: Schema = new Schema({
    ingrediente: { type: String, required: true, default: '' },
    cantidad: { type: Number, required: true, default: 0 }
}, { 
    timestamps: true 
});

ingredientItemSchema.index({ ingrediente: 'text',  tags: 'text' });

const IngredientItem: Model<IIngredientItem> = mongoose.models.IngredientItem || model('IngredientItem', ingredientItemSchema);

export default IngredientItem;