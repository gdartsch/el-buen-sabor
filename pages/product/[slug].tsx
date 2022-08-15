import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useContext } from 'react';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductSlideshow } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { dbIngredients, dbProducts } from '../../database';
import { ICartProduct, IIngredient, IProduct } from '../../interfaces';
import { CartContext } from '../../context/cart/CartContext';
import { useIngredients } from '../../hooks';

interface Props {
  product: IProduct;
  totalStock: number;
}

const ProductPage:NextPage<Props> = ({product, totalStock}) => {

  const router = useRouter();
  const { addProductToCard } = useContext( CartContext );

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    nombre: product.nombre,
    imagen: product.imagen,
    precio: product.precio,
    recipe: product.recipe,
    slug: product.slug,
    estimatedTimeMinutes: product.estimatedTimeMinutes,
    maximo: totalStock,
    cantidad: 1,
  })

  const onUpdateQuantity = (cantidad: number) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      cantidad
    }))
  }

  const onAddProduct = () => {
    addProductToCard(tempCartProduct);
    router.push('/cart');
  }

  return (
    <ShopLayout title={ product.nombre } pageDescription={ product.descripcion }>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow
            imagen={ product.imagen }
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            <Typography variant='h1' component='h1'>{ product.nombre }</Typography>
            <Typography variant='subtitle1' component='h2'>{`$${product.precio}`}</Typography>

            <Box sx={{my: 2}}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter
                currentValue={tempCartProduct.cantidad}
                updatedQuantity={onUpdateQuantity}
                maxValue={totalStock}
              />
            </Box>    
            {
              (totalStock > 0)
                ? (
                  <Button 
                    color="secondary" 
                    className='circular-btn'
                    onClick={ onAddProduct }
                  >
                    Agregar al carrito
                  </Button>
                ) 
                : (
                  <Chip label='No hay Stock' color='error' variant='outlined'/>
                )
            }
            <Box sx={{ mt:3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{ product.descripcion }</Typography>
            </Box>

          </Box>
        </Grid>

      </Grid>
    </ShopLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  
  const productSlugs = await dbProducts.getAllProductsSlugs();

  return {
    paths: productSlugs.map(({slug}) => ({
      params: {
        slug: slug
      }
    })),
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const { slug = '' } = params as { slug: string }; 
  const product = await dbProducts.getProductBySlug(slug);

  let ingredients: IIngredient[] = [];

  for(let i = 0; i < product!.recipe.length; i++) {
    let name = product?.recipe[i][0];
    let ingredient = await dbIngredients.getIngredientsByName(name as string);
    for(let j = 0; j < ingredient!.length; j++) {
      ingredients.push(ingredient![j]);
    }
  }

  const stock = (): number => {
    let neededIngredients = product!.recipe as [string, number][];
    let sotckedIngredients = ingredients.map(ingredient => ingredient.inStock);
    
    let stock: number[] = [];

    for(let i = 0; i < neededIngredients.length; i++){
        stock.push(sotckedIngredients[i] / neededIngredients[i][1]);
    }

    if(neededIngredients.length > sotckedIngredients.length) {
      console.log('No hay stock');
      return 0;
    }
    return Math.trunc(Math.min(...stock));
}

  let totalStock = stock();

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product,
      totalStock
    },
    revalidate: 86400 //una vez por día
  }
}

export default ProductPage