import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces/products'
import { Product } from '../../../models'

type Data = { message: string } | IProduct[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return searchProducts(req, res)
    default:
      return res.status(400).json({
        message: 'Bad request',
      })
  }
}

const searchProducts = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  let { q = '' } = req.query

  if (q.length === 0) {
    return res.status(400).json({
      message: 'No se ha ingresado ningun termino de busqueda',
    })
  }

  q = q.toString().toLowerCase()

  await db.connect()

  const products = await Product.find({
    $text: { $search: q },
  })
    .select('nombre imagenes precio inStock slug -_id')
    .lean()

  await db.disconnect()

  //@ts-ignore
  res.status(200).json(products)
}
