import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'

type Data = 
| { message: string }
| IProduct[]

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts( req, res )

        default:
            return res.status(400).json({ 
                message: 'Bad request' 
            })
    }

    res.status(200).json({ message: 'Example' })

}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { categoria = 'all' } = req.query;

    let condition = {};

    if(categoria !== 'all' && SHOP_CONSTANTS.validCategories.includes(`${categoria}`)) {
        condition = { categoria };
    }

    await db.connect();

    const products: IProduct[] = await Product.find(condition)
                                .select('nombre imagen precio slug recipe -_id')
                                .lean();

    await db.disconnect();

    const updatedProducts = products.map(product => {
        product.imagen = product.imagen.includes('http') 
         ? product.imagen 
        : `${process.env.HOST_NAME}products/${product.imagen}`;

        return product;
    });

    res.status(200).json( updatedProducts )

}
