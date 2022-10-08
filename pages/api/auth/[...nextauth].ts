import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { dbUsers } from '../../../database'

export default NextAuth({
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        )
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  jwt: {},

  session: {
    maxAge: 2592000, // 30 días
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token

        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthCreateOrLoginUser(
              user?.email || '',
              user?.name || ''
            )
            break
          case 'credentials':
            token.user = user
            break
        }
      }

      return token
    },

    async session({ session, token, user }) {
      session.accessToken = token.accessToken
      session.user = token.user as any

      return session
    },
  },
})
