import { FC, useMemo, useState } from "react";
import NextLink from "next/link";
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from "@mui/material";
import { IProduct } from "../../interfaces";
import { GetStaticProps } from "next";
import { dbIngredients, dbProducts } from "../../database";
import { useIngredients } from "../../hooks";
import { FullScreenLoading } from "../ui";
import { IIngredient } from '../../interfaces/ingredient';

interface Props {
    product: IProduct;
}

export const ProductCard: FC<Props> = ({product}) => {

    const [isHovered, setIsHovered] = useState(false)

    let ingredients: IIngredient[] = [];

    for(let i = 0; i < product.recipe.length; i++){
        const { ingredient } = useIngredients(`/ingredients?nombre=${product.recipe[i][0]}`);
        for(let j = 0; j < ingredient.length; j++){
            ingredients.push(ingredient[j]);
        };
    }

    
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    
    const stock = (): number => {
        let neededIngredients = product.recipe as [string, number][];
        let sotckedIngredients = ingredients!.map(ingredient => ingredient.inStock);
        
        let stock: number[] = [];

        for(let i = 0; i < neededIngredients.length; i++){
            stock.push(sotckedIngredients[i] / neededIngredients[i][1]);
        }

        if(neededIngredients.length > sotckedIngredients.length) {
            return 0;
        }

        return Math.trunc(Math.min(...stock));
    }
    return (
        <Grid item 
        xs={6} 
        sm={4} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
            <Card>
                <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
                    <Link>
                        <CardActionArea>
                            {
                                (stock() <= 0) && (
                                    <Chip
                                        color='primary'
                                        label='Sin stock'
                                        sx={{ position: 'absolute', zIndex: 99,  top:'10px', right:'10px' }}
                                    />
                                )
                            }
                            
                            <CardMedia
                                component='img'
                                className='fadeIn'
                                image={ product.imagen }
                                alt={ product.nombre }
                                onLoad={() => setIsImageLoaded(true)}
                                sx={{ width: '300px', height: '300px', objectFit: 'cover' }}
                            />
                        </CardActionArea>
                    </Link>
                </NextLink>   
            </Card>

            <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
                <Typography fontWeight={700}>{product.nombre}</Typography>
                <Typography fontWeight={500}>{`$${product.precio}`}</Typography>
            </Box>
        </Grid>
    )
}