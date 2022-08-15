import mongoose, { Schema, model, Model } from "mongoose";
import { IOrder } from "../interfaces";

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [{ 
        _id: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
        nombre: {type: String, required: true},
        cantidad: {type: Number, required: true},
        slug: {type: String, required: true},
        estimatedTimeMinutes: {type: Number, required: true},
        imagen: {type: String, required: true},
        precio: {type: Number, required: true},
    }],
    sendAddress: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        address: {type: String, required: true},
        address2: {type: String},
        cp: {type: String, required: true},
        department: {type: String, required: true},
        phone: {type: String, required: true},
    },
    
    numberOfItems: {type: Number, required: true},
    subTotal: {type: Number, required: true},
    tax: {type: Number, required: true},
    discount: {type: Number, required: true},
    total: {type: Number, required: true},
    estimatedTime: {type: Number, required: true},

    currentState: [{
        type: String,
        enum: ['Ingresado', 'En Cocina', 'En delivery', 'Entregado', 'Cancelado'],
        message: 'La categoria debe ser una de las siguientes: Ingresado, En Cocina, En delivery, Entregado, Cancelado',    
        default: 'Ingresado',
        required: true
    }],

    paidMethod: [{
        type: String,
        enum: ['MercadoPago', 'Efectivo'],
        message: 'La categoria debe ser una de las siguientes: MercadoPago, Efectivo',    
        default: 'MercadoPago'
    }],
    isPaid: {type: Boolean, required: true, default: false},
    paidAt: {type: String },

    transactionId: {type: String },
}, { 
    timestamps: true,
});

const Order: Model<IOrder> = mongoose.models.Order || model('Order', orderSchema);

export default Order;