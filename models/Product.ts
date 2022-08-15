import mongoose, { Schema, model, Model} from "mongoose";
import { IProduct } from "../interfaces";

const productSchema: Schema = new Schema({
    nombre: { type: String, required: true, default: '' },
    categoria: [{
        type: String,
        enum: ['bebida', 'hamburguesa', 'pizza', 'pancho', 'guarnicion', 'lomo', 'otro'],
        message: 'La categoria debe ser una de las siguientes: bebida, hamburguesa, pizza, pancho, guarnicion, lomo, otro',    
        default: 'pizza'
    }],
    imagen: { type: String, default: '' },
    precio: { type: Number, required: true, default: 0 },
    descripcion: { type: String, required: true, default: '' },
    slug: { type: String, required: true, unique: true },
    estimatedTimeMinutes: { type: Number, required: true, default: 0 },
    recipe: [{type: [String, Number], required: true, default: []}],
    active: { type: Boolean, required: true, default: true },
}, { 
    timestamps: true 
});

productSchema.index({ nombre: 'text', tags: 'text' });

const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema);

export default Product;
