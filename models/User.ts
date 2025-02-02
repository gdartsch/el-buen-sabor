import mongoose, { model, Model, Schema } from 'mongoose'
import { IUser } from '../interfaces'

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: {
        values: ['Admin', 'User', 'Chef', 'Delivery', 'Cashier'],
        message: 'No es un rol válido',
        default: 'User',
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
)

const User: Model<IUser> = mongoose.models.User || model('User', userSchema)

export default User
