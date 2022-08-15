import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui';

 

const HamburguesasPage: NextPage = () => {



  const {products, isLoading} = useProducts('/products?categoria=hamburguesa');

  return (
    <ShopLayout 
      title={'El Buen Sabor - Hamburguesas'} 
      pageDescription={'Las mejores hamburguesas'}
    >
      <Typography variant='h1' component='h1'>Hamburguesas</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

      {
        isLoading 
        ? <FullScreenLoading/>
        : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default HamburguesasPage