import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data = 
|{ message: string }
| IProduct

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProductsBySlug( req, res );
        default:
            return res.status(400).json({
                message: 'Bad request'
            })
        }
}

const getProductsBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();

    const { slug } = req.query;

    const product: IProduct = await Product.findOne({ slug })
                                .select('nombre imagen precio inStock slug -_id') 
                                .lean();

    await db.disconnect();

    if(!product) {
        return res.status(404).json({
            message: 'Producto no encontrado'
        })
    }

    product.imagen = product.imagen.includes('http') 
    ? product.imagen 
    : `${process.env.HOST_NAME}products/${product.imagen}`;

    res.status(200).json( product )
}
