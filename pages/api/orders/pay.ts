import mercadoPago from 'mercadopago'
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'

type Data = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return payOrder(req, res)
    default:
      return res.status(400).json({ message: 'Bad Request' })
  }
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  })

  const orderId = req.body.orderId

  mercadoPago.configure({
    access_token: `${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
  })
  let preference = {
    back_urls: {
      success: `${process.env.HOST_NAME}/orders/${orderId}?paid=true`,
      failure: `${process.env.HOST_NAME}/orders/${orderId}?paid=false`,
      pending: `${process.env.HOST_NAME}/orders/${orderId}?paid=pending`,
    },

    external_reference: `${orderId}`,
    items: [
      {
        title: req.body.title,
        description: req.body.description,
        unit_price: parseFloat(req.body.price),
        quantity: req.body.quantity,
      },
    ],
  }

  const mpResponse = await mercadoPago.preferences.create(preference)

  return res.status(200).json({ message: mpResponse.body.init_point })
}
