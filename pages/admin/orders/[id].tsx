import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { CartList, OrderSummary } from '../../../components/cart'
import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { IOrder } from '../../../interfaces';
import { dbOrders } from '../../../database';
import { AdminLayout } from '../../../components/layouts/AdminLayout';

interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({order}) => {

    return (
        <AdminLayout title={"Resumen de la orden"} subTitle={`${order._id}`}>

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
                                        total: order.total,
                                        discount: order.discount,
                                        tax: order.tax,
                                        estimatedTime: order.estimatedTime,
                                    }}
                                    ordered = {true}
                                    isAdmin = {true}
                                />
        
                                <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                    
                                    <Box 
                                        flexDirection='column'
                                    >
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
                                    </Box>
                                    
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
        
            </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

    const { id= '' } = query;

    const order = await dbOrders.getOrderById( id.toString() );
    
    if(!order) {
        return {
            redirect: {
                destination: '/admin/orders/',
                permanent: false,
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage