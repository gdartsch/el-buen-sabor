import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database';
import { Ingredient, Order, Product, User } from '../../models';

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if(process.env.NODE_ENV === 'production') {
        return res.status(401).json({ message: 'No tiene acceso a esta api' })
    }

    await db.connect();
    await User.deleteMany();
    await User.insertMany( seedDatabase.initialData.users );
    await Product.deleteMany();
    await Product.insertMany( seedDatabase.initialData.products );
    await Ingredient.deleteMany();
    await Ingredient.insertMany( seedDatabase.initialData.ingredients );
    await Order.deleteMany();
    await db.disconnect();


    res.status(200).json({ message: 'Proceso realizado correctamente' });
}