import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database'
import { IIngredient } from '../../../interfaces/ingredient';
import { Ingredient } from '../../../models';

type Data = 
| { message: string }
| IIngredient

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getIngredients( req, res )

        default:
            return res.status(400).json({ 
                message: 'Bad request' 
            })
    }

    res.status(200).json({ message: 'Example' })

}

const getIngredients = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { nombre = '' } = req.query;

    let condition = { nombre };

    await db.connect();

    const ingredient = await Ingredient.find( {nombre: nombre} )
                                .select('nombre unidadMedida categoria costoUnidad inStock minStock active slug -_id')
                                .lean();

    await db.disconnect();

    res.status(200).json( ingredient as any )
}