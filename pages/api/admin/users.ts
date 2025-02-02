import { isValidObjectId } from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IUser } from '../../../interfaces'
import { User } from '../../../models'

type Data = { message: string } | IUser[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getUsers(req, res)
    case 'PUT':
      return updateUser(req, res)
    default:
      return res.status(400).json({ message: 'Bad Request' })
  }
}

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = '', role = '' } = req.body

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'No existe usuario con esa id' })
  }

  const validRoles = ['Admin', 'User', 'Chef', 'Delivery', 'Cashier']

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'No es un rol válido' })
  }

  await db.connect()
  const user = await User.findById(userId)
  if (!user) {
    await db.disconnect()
    return res.status(400).json({ message: 'No existe usuario con esa id' })
  }

  user.role = role
  await user.save()

  await db.disconnect()

  res.status(200).json({ message: 'Usuario actualizado correctamente' })
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect()
  const users = await User.find().select('-password').lean()
  await db.disconnect()

  res.status(200).json(users)
}
