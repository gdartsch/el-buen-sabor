import { Box, Typography } from '@mui/material'
import type { NextPage, GetServerSideProps } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { dbProducts } from '../../database'
import { IProduct } from '../../interfaces'

interface Props {
  products: IProduct[]
  foundProducts: boolean
  query: string
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout
      title={'El Buen Sabor - Busqueda'}
      pageDescription={'Los mejores sabores directo a la puerta de su hogar'}
    >
      <Typography variant='h1' component='h1'>
        Buscar productos
      </Typography>

      {foundProducts ? (
        <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>
          Búsqueda: {query}
        </Typography>
      ) : (
        <Box display='flex'>
          <Typography variant='h2' sx={{ mb: 1 }}>
            No se encontraron resultados
          </Typography>
          <Typography
            variant='h2'
            sx={{ ml: 1 }}
            color='secondary'
            textTransform='capitalize'
          >
            {query}
          </Typography>
        </Box>
      )}

      <ProductList products={products} />
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query: string }

  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  let products = await dbProducts.getProductsByTerm(query)
  const foundProducts = products.length > 0

  if (!foundProducts) {
    products = await dbProducts.getAllProducts()
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  }
}

export default SearchPage
