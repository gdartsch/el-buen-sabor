import { Box, Button, Grid, TextField, Typography } from "@mui/material"
import { ShopLayout } from "../../components/layouts"


const AddressPage = () => {
  return (
    <ShopLayout title={"Dirección"} pageDescription={"Confirmar dirección del destino"}>
        <Typography variant="h1" component='h1'>Dirección</Typography>

        <Grid container spacing={2} sx={{ mt: 2}}>
            <Grid item xs={12} sm ={6}>
                <TextField label='Nombre' variant="filled" fullWidth/>
            </Grid>
            <Grid item xs={12} sm ={6}>
                <TextField label='Apellido' variant="filled" fullWidth/>
            </Grid>
            <Grid item xs={12} sm ={6}>
                <TextField label='Dirección' variant="filled" fullWidth/>
            </Grid>
            <Grid item xs={12} sm ={6}>
                <TextField label='Dirección 2 (Opcional)' variant="filled" fullWidth/>
            </Grid>
            <Grid item xs={12} sm ={6}>
                <TextField label='Código Postal' variant="filled" fullWidth/>
            </Grid>
            <Grid item xs={12} sm ={6}>
                <TextField label='Ciudad' variant="filled" fullWidth/>
            </Grid>
            <Grid item xs={12} sm ={6}>
                <TextField label='Teléfono' variant="filled" fullWidth/>
            </Grid>
        </Grid>

        <Box sx ={{ mt: 5 }} display='flex' justifyContent='center'>
            <Button color='secondary' className="circular-btn" size="large">
                Revisar Pedido
            </Button>
        </Box>

    </ShopLayout>
  )
}

export default AddressPage