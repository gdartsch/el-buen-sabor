import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material"
import { CartList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layouts"
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';


const SummaryPage = () => {

    const router = useRouter();
    const { sendAddress, numberOfItems, createOrder } = useContext(CartContext);

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if(!Cookies.get('firstName')){
            router.push('/checkout/address');
        }
    }, [ router ])

    const onCreateOrderNoDiscount = async () => {
        setIsPosting(true);
        const { hasError, message } = await createOrder(false);

        if(hasError){
            setIsPosting(false);
            setErrorMessage(message);
            return;
        }

        router.replace(`/orders/${message}`);
    }

    const onCreateOrderWithDiscount = async () => {
        setIsPosting(true);
        const { hasError, message } = await createOrder(true);

        if(hasError){
            setIsPosting(false);
            setErrorMessage(message);
            return;
        }

        router.replace(`/orders/${message}`);
    }
    

    if (!sendAddress) {
        return <></>;
    }

    const { firstName, lastName, address, address2, cp, department, phone } = sendAddress;

    return (
        <ShopLayout title={"Resumen de orden"} pageDescription={"Resumen de la orden"}>
            <Typography variant="h1" component="h1">Resumen de la orden</Typography>
    
            <Grid container>
                <Grid item xs={ 12 } sm={ 7 }>
                    <CartList />
                </Grid>
                <Grid item xs={12} sm ={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography 
                                variant="h2" 
                                component="h2">Resumen ({numberOfItems} {numberOfItems === 1 ? 'producto' : 'productos'}  ) 
                            </Typography>
                            <Divider sx ={{ my:1 }}/>
                            
                            <Box display='flex' justifyContent='end'>
                                <NextLink href='checkout/address' passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            <Typography>{firstName} {lastName}</Typography>
                            <Typography>{address}{address2 ? ` ,${address2}` : ''}</Typography>
                            <Typography>{department}</Typography>
                            <Typography>{phone}</Typography>

                            <Divider sx ={{ my:1 }}/>

                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/cart' passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary
                                ordered={false}
                                isAdmin={false}
                            />
    
                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                <Button 
                                    color='secondary' 
                                    className='circular-btn' 
                                    fullWidth
                                    onClick={ onCreateOrderWithDiscount }
                                    disabled={ isPosting }
                                >
                                    Pagar en local
                                </Button>

                                <Button 
                                    color='secondary' 
                                    className='circular-btn' 
                                    fullWidth
                                    onClick={ onCreateOrderNoDiscount }
                                    disabled={ isPosting }
                                >
                                    Pagar con Mercado Pago
                                </Button>

                                <Chip
                                    color="error"
                                    label={errorMessage}
                                    sx={{display: errorMessage ? 'flex' : 'none', mt: 2}}
                                />

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
    
        </ShopLayout>
      )
}

export default SummaryPage