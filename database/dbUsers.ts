import bcrypt from 'bcryptjs'
import { db } from '.'
import { User } from '../models'

export const checkUserEmailPassword = async (
  email: string,
  password: string
) => {
  await db.connect()
  const user = await User.findOne({ email })
  await db.disconnect()

  if (!user) return null

  if (!bcrypt.compareSync(password, user.password!)) return null

  const { role, name, _id } = user

  return {
    _id,
    email: email.toLowerCase(),
    role,
    name,
  }
}

export const oAuthCreateOrLoginUser = async (
  oAuthEmail: string,
  oAuthName: string
) => {
  await db.connect()
  const user = await User.findOne({ email: oAuthEmail })

  if (user) {
    await db.disconnect()
    const { _id, name, email, role } = user
    return { _id, name, email, role }
  }

  const newUser = new User({
    email: oAuthEmail,
    name: oAuthName,
    password: '@',
    role: 'User',
  })
  await newUser.save()
  await db.disconnect()

  const { _id, name, email, role } = newUser
  return { _id, name, email, role }
}

export const getCooks = async () => {
  await db.connect()
  const user = await User.find({ role: 'Chef' })
  await db.disconnect()

  if (!user) return null

  return user.length
}
