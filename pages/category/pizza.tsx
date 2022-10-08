import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'
import { useProducts } from '../../hooks'

const PanchosPage: NextPage = () => {
  const { products, isLoading } = useProducts('/products?categoria=pizza')

  return (
    <ShopLayout
      title={'El Buen Sabor - Pizzas'}
      pageDescription={'Las mejores pizzas'}
    >
      <Typography variant='h1' component='h1'>
        Pizzas
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        Todos los productos
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  )
}

export default PanchosPage
