export interface IUser {
  _id: string
  name: string
  email: string
  password?: string
  role: IRole

  createdAt?: string
  updatedAt?: string
}

export type IRole = 'Admin' | 'User' | 'Chef' | 'Delivery' | 'Cashier'
