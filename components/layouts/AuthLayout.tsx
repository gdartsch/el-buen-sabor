import { Box } from '@mui/material'
import Head from 'next/head'
import * as React from 'react'
import { FC } from 'react'

interface Props {
  title: string
  children?: React.ReactNode
}

export const AuthLayout: FC<Props> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>Auth Layout</title>
      </Head>

      <main>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='calc(100vh - 200px)'
        >
          {children}
        </Box>
      </main>
    </>
  )
}
