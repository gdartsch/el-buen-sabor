import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui';

 

const OtrosPage: NextPage = () => {



  const {products, isLoading} = useProducts('/products?categoria=otro');

  return (
    <ShopLayout 
      title={'El Buen Sabor - Otros'} 
      pageDescription={'Las mejores comidas directo a su mesa'}
    >
      <Typography variant='h1' component='h1'>Otros</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

      {
        isLoading 
        ? <FullScreenLoading/>
        : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default OtrosPage