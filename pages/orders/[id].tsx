import { Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { db, dbOrders, dbUsers } from '../../database';
import { IOrder } from '../../interfaces';
import elBuenSaborApi from '../../api/elBuenSaborApi';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Order } from '../../models';
import { generatePdf } from "html-pdf-node-ts";

export type OrderResponseBody = {
    id: string;
    status:
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED";
};

interface Props {
    order: IOrder;
    time: number;
}

const OrderPage: NextPage<Props> = ({order, time}) => {

    const router = useRouter();

    const [isPaying, setIsPaying] = useState(false);

    const onOrderCompleted = async( details: IOrder ) => {
        
        setIsPaying(true);

        let jsonToSend = {
            ...details,
            orderItems: order.orderItems.map(item => ({
                ...item,
                price: item.precio,
            }))
        };


        try {
            
            const { data } = await elBuenSaborApi.post(`/orders/pay`, {
                thisUrl: `${process.env.NEXT_PUBLIC_URL}/orders/${details.id}`,
                orderId: details._id,
                transactionId: details.transactionId,
                title: jsonToSend.orderItems.map(item => item.nombre).join(', '),
                description: jsonToSend.orderItems.map(item => item.nombre).join(', '),
                price: jsonToSend.orderItems.map(item => item.precio).reduce((a, b) => a + b, 0),
                quantity: jsonToSend.orderItems.map(item => item.cantidad).reduce((a, b) => a + b, 0),
            });

            router.replace(data.message);

        } catch (error) {
            setIsPaying(false);
            console.log(error);
            alert('Error');
        }
    }

    return (
        <ShopLayout title={"Resumen de la orden"} pageDescription={"Resumen de la orden"}>
                <Typography variant="h1" component="h1">Orden: {order._id}</Typography>

                {
                    order.isPaid
                        ? (
                            <Chip
                                sx={{ my:2 }}
                                label="Pagada"
                                variant='outlined'
                                color='success'
                                icon={<CreditScoreOutlined />} 
                            />
                        )
                        : (
                            <Chip
                                sx={{ my:2 }}
                                label="Pendiente de pago"
                                variant='outlined'
                                color='error'
                                icon={<CreditCardOffOutlined />} 
                            />
                        )
                }

                <Grid container className='fadeIn'>
                    <Grid item xs={12} sm ={7}>
                        <CartList products={ order.orderItems }/>
                    </Grid>
                    <Grid item xs={12} sm ={5}>
                        <Card className='summary-card'>
                            <CardContent>
                                <Typography variant="h2" component="h2">
                                    Resumen 
                                    ({order.numberOfItems} 
                                    {order.numberOfItems > 1 ? 'productos' : 'producto'})
                                </Typography>
                                <Divider sx ={{ my:1 }}/>

                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <Typography>{order.sendAddress.firstName} {order.sendAddress.lastName}</Typography>
                                <Typography>{order.sendAddress.department}</Typography>
                                <Typography>
                                    {order.sendAddress.address}
                                    {order.sendAddress.address2 ? ` ,${order.sendAddress.address2}` : ''}
                                </Typography>
                                <Typography>{order.sendAddress.phone}</Typography>

                                <Divider sx ={{ my:1 }}/>

                                <Box display='flex' justifyContent='end'>
                                    <NextLink href='/cart' passHref>
                                        <Link underline='always'>
                                            Editar
                                        </Link>
                                    </NextLink>
                                </Box>

                                <OrderSummary 
                                    orderValues={{
                                        numberOfItems: order.numberOfItems,
                                        subTotal: order.subTotal,
                                        discount: order.discount,
                                        total: order.total,
                                        tax: order.tax,
                                        estimatedTime: order.estimatedTime + time + (order.paidMethod === 'Efectivo' ? 0 : 10),
                                    }}
                                    ordered={true}
                                    isAdmin={false}
                                />
        
                                <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                    
                                    <Box 
                                        display='flex' 
                                        justifyContent='center' 
                                        className='fadeIn'
                                        sx={{ display: isPaying ? 'flex' : 'none' }}
                                    >
                                        <CircularProgress/>
                                    </Box>
                                    
                                    <Box 
                                        sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
                                        flexDirection='column'
                                    >
                                        {  
                                            order.paidMethod[0] === 'MercadoPago' ?
                                                order.isPaid
                                                    ? (
                                                        <Chip
                                                            sx={{ my:2 }}
                                                            label="Pagada"
                                                            variant='outlined'
                                                            color='success'
                                                            icon={<CreditScoreOutlined />} 
                                                        />
                                                    )
                                                    : 
                                                    (
                                                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                                                <Button 
                                                                    color='secondary' 
                                                                    className='circular-btn' 
                                                                    fullWidth
                                                                    onClick={ () => { onOrderCompleted(order) } }
                                                                    
                                                                >
                                                                    Pagar orden
                                                                </Button>                                                   
                                                        </Box>
                                                    )
                                            : 
                                            
                                            (
                                                <Chip
                                                            sx={{ my:2 }}
                                                            label="A Pagar en local"
                                                            variant='outlined'
                                                            color='success'
                                                            icon={<CreditScoreOutlined />} 
                                                        />
                                            )
                                        }

                                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                                <Button 
                                                    color='secondary' 
                                                    className='circular-btn' 
                                                    fullWidth
                                                    href="javascript:window.print()"     
                                                >
                                                    Descargar orden
                                                </Button>                                                   
                                        </Box>
                                    </Box>
                                    
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
        
            </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

    const { id= '', paid = '' } = query;
    const session:any = await getSession({req});

    if(!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false,
            }
        }
    }

    let order = await dbOrders.getOrderById( id.toString() );
    
    if(!order) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    }

    if (order.user !== session.user._id) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    }

    if(paid === 'true') {
        await db.connect();
        const dbOrder = await Order.findById(order._id);

        if ( !dbOrder ) {
            await db.disconnect();
        }else{
            dbOrder.isPaid = true;
            await dbOrder.save();
            await db.disconnect()
            order = await dbOrders.getOrderById( id.toString() );
        }       
    }

    let time = 0;
    const data = await dbOrders.getAllOrders();
    
    let validOrders = data.filter((order: { currentState: { toString: () => string; }; }) => order.currentState.toString() === 'En Cocina');
    
    const realValidOrders = validOrders.filter((order => order._id != id));

    time = realValidOrders.reduce((acc: any, order: { estimatedTime: any; }) => {
        return acc + order.estimatedTime;
    } , 0);

    const cooks = await dbUsers.getCooks();

    cooks === 0 || cooks == null ? time = time : time /= cooks!;
    
    return {
        props: {
            order,
            time,
        }
    }
}

export default OrderPage