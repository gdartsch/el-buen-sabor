import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui';

 

const GuarnicionesPage: NextPage = () => {



  const {products, isLoading} = useProducts('/products?categoria=guarnicion');

  return (
    <ShopLayout 
      title={'El Buen Sabor - Guarniciones'} 
      pageDescription={'Las mejores guarniciones para acompañar su comida favorita'}
    >
      <Typography variant='h1' component='h1'>Guarniciones</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

      {
        isLoading 
        ? <FullScreenLoading/>
        : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default GuarnicionesPage