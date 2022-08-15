import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui';

 

const LomosPage: NextPage = () => {



  const {products, isLoading} = useProducts('/products?categoria=lomo');

  return (
    <ShopLayout 
      title={'El Buen Sabor - Lomos'} 
      pageDescription={'Los mejores lomos'}
    >
      <Typography variant='h1' component='h1'>Lomos</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

      {
        isLoading 
        ? <FullScreenLoading/>
        : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default LomosPage