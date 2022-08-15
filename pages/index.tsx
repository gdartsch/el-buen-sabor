import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';
import { useIngredients, useProducts } from '../hooks/';
import { FullScreenLoading } from '../components/ui/';
import { useSession } from 'next-auth/react';

 

const HomePage: NextPage = () => {

  const {products, isLoading} = useProducts('/products'); 

  return (
    <ShopLayout 
      title={'El Buen Sabor - Home'} 
      pageDescription={'Los mejores sabores directo a la puerta de su hogar'}
    >
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

      {
        isLoading 
        ? <FullScreenLoading/>
        : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default HomePage
