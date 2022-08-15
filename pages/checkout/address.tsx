import { Box, Button, Grid, TextField, Typography } from "@mui/material"
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { ShopLayout } from "../../components/layouts"
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CartContext } from "../../context";

type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    cp: string;
    department: string;
    phone: string;
}

const getAddressFromCookies = () => {
    return {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        cp: Cookies.get('cp') || '',
        department: Cookies.get('department') || '',
        phone: Cookies.get('phone') || '',
    }
}


const AddressPage = () => {

    const router = useRouter();
    const { updateAddress } = useContext(CartContext);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            cp: '',
            department: '',
            phone: '',
        }
    });

    useEffect(() => {
      reset(getAddressFromCookies());
    }, [reset])
    

    const onSubmitAddress = (data: FormData) => {
        updateAddress( data );
        router.push('/checkout/summary');
    }

    return (
        <ShopLayout title={"Dirección"} pageDescription={"Confirmar dirección del destino"}>
            <form onSubmit={ handleSubmit(onSubmitAddress) } noValidate>
                <Typography variant="h1" component='h1'>Dirección</Typography>

                <Grid container spacing={2} sx={{ mt: 2}}>
                    <Grid item xs={12} sm ={6}>
                        <TextField 
                            label='Nombre' 
                            variant="filled" 
                            fullWidth
                            { ...register('firstName',{
                                required: 'Este campo es requerido',
                            })}
                            error= { !!errors.firstName }
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm ={6}>
                        <TextField 
                            label='Apellido' 
                            variant="filled" 
                            fullWidth
                            { ...register('lastName',{
                                required: 'Este campo es requerido',
                            })}
                            error= { !!errors.lastName }
                            helperText={errors.lastName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm ={6}>
                        <TextField 
                            label='Dirección' 
                            variant="filled" 
                            fullWidth
                            { ...register('address',{
                                required: 'Este campo es requerido',
                            })}
                            error= { !!errors.address }
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm ={6}>
                        <TextField 
                            label='Dirección 2 (Opcional)' 
                            variant="filled" 
                            fullWidth
                            { ...register('address2')}
                        />
                    </Grid>
                    <Grid item xs={12} sm ={6}>
                        <TextField 
                            label='Código Postal' 
                            variant="filled" 
                            fullWidth
                            { ...register('cp',{
                                required: 'Este campo es requerido',
                            })}
                            error= { !!errors.cp }
                            helperText={errors.cp?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm ={6}>
                        <TextField 
                            label='Departamento' 
                            variant="filled" 
                            fullWidth
                            { ...register('department',{
                                required: 'Este campo es requerido',
                            })}
                            error= { !!errors.department }
                            helperText={errors.department?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm ={6}>
                        <TextField 
                            label='Teléfono' 
                            variant="filled" 
                            fullWidth
                            { ...register('phone',{
                                required: 'Este campo es requerido',
                            })}
                            error= { !!errors.phone }
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                <Box sx ={{ mt: 5 }} display='flex' justifyContent='center'>
                    <Button type='submit' color='secondary' className="circular-btn" size="large">
                        Revisar Pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    )
}



export default AddressPage