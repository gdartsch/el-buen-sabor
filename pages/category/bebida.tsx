import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui';

 

const BebidasPage: NextPage = () => {



  const {products, isLoading} = useProducts('/products?categoria=bebida');

  return (
    <ShopLayout 
      title={'El Buen Sabor - Bebidas'} 
      pageDescription={'Las mejores bebidas para acompañar su comida favorita'}
    >
      <Typography variant='h1' component='h1'>Bebidas</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

      {
        isLoading 
        ? <FullScreenLoading/>
        : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default BebidasPage