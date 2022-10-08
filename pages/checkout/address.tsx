import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ShopLayout } from '../../components/layouts'
import { CartContext } from '../../context'
import data from '../../data/data-provincias.json'

type FormData = {
  firstName: string
  lastName: string
  state: string
  city: string
  address: string
  address2?: string
  cp: string
  department: string
  phone: string
}

const getAddressFromCookies = () => {
  return {
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('lastName') || '',
    state: Cookies.get('state') || '',
    city: Cookies.get('city') || '',
    address: Cookies.get('address') || '',
    address2: Cookies.get('address2') || '',
    cp: Cookies.get('cp') || '',
    department: Cookies.get('department') || '',
    phone: Cookies.get('phone') || '',
  }
}

const menuProps: any = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  PaperProps: {
    sx: {
      maxHeight: 200,
      width: '20ch',
    },
  },
}

const AddressPage = () => {
  const router = useRouter()
  const { updateAddress } = useContext(CartContext)
  const [provincias, setProvincias] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [departamentosByProvincia, setDepartamentosByProvincia] = useState([])
  const [selectedDepartamento, setSelectedDepartamento] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      state: '',
      city: '',
      address: '',
      address2: '',
      cp: '',
      department: '',
      phone: '',
    },
  })

  const getDepartamentosByProvincia = (provincia) => {
    setDepartamentosByProvincia(() => {
      const departamentos = data.departamentos.filter(
        (departamento) => departamento.provincia.nombre === provincia
      )
      const departamentosNames = departamentos.map(
        (departamento) => departamento.nombre
      )
      return departamentosNames
    })
  }

  useEffect(() => {
    reset(getAddressFromCookies())
    setProvincias(data.provincias.map((p) => p.iso_nombre))
  }, [reset, data])

  const onSubmitAddress = (data: FormData) => {
    updateAddress(data)
    router.push('/checkout/summary')
  }

  return (
    <ShopLayout
      title={'Dirección'}
      pageDescription={'Confirmar dirección del destino'}
    >
      <form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
        <Typography variant='h1' component='h1'>
          Dirección
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Nombre'
              variant='standard'
              fullWidth
              {...register('firstName', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Apellido'
              variant='standard'
              fullWidth
              {...register('lastName', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Provincia'
              variant='standard'
              fullWidth
              select
              SelectProps={{ MenuProps: menuProps }}
              {...register('state', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.state}
              helperText={errors.state?.message}
              onChange={(e) => {
                setSelectedState(e.target.value)
                getDepartamentosByProvincia(e.target.value)
              }}
            >
              {provincias.map((provincia) => (
                <MenuItem key={provincia} value={provincia}>
                  {provincia}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Departamento'
              variant='standard'
              fullWidth
              select
              SelectProps={{ MenuProps: menuProps }}
              {...register('department', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.department}
              helperText={errors.department?.message}
              onChange={(e) => setSelectedDepartamento(e.target.value)}
              disabled={!selectedState}
            >
              {departamentosByProvincia.map((departamento) => (
                <MenuItem key={departamento} value={departamento}>
                  {departamento}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Dirección'
            variant='standard'
            fullWidth
            {...register('address', {
              required: 'Este campo es requerido',
            })}
            error={!!errors.address}
            helperText={errors.address?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Dirección 2 (Opcional)'
            variant='standard'
            fullWidth
            {...register('address2')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Código Postal'
            variant='standard'
            fullWidth
            {...register('cp', {
              required: 'Este campo es requerido',
            })}
            error={!!errors.cp}
            helperText={errors.cp?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label='Teléfono'
            variant='standard'
            fullWidth
            {...register('phone', {
              required: 'Este campo es requerido',
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </Grid>

        <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
          <Button
            type='submit'
            color='secondary'
            className='circular-btn'
            size='large'
          >
            Revisar Pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  )
}

const getStaticProps = async () => {
  return {
    props: {
      dataProvincias: data,
    },
  }
}

export default AddressPage
