import { DriveFileRenameOutline, SaveOutlined } from '@mui/icons-material'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  capitalize,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { elBuenSaborApi } from '../../../api'
import { AdminLayout } from '../../../components/layouts'
import { dbIngredients } from '../../../database'
import { IIngredient, IIngredientCategories, IUnit } from '../../../interfaces'
import { Ingredient } from '../../../models'

const validCaterogies = [
  'bebida',
  'lacteos',
  'carne',
  'panificados',
  'vegetales',
  'condimentos',
  'otro',
]
const validTypes = ['Kg', 'Lt', 'Gr', 'Unidad', 'Otro']

interface FormData {
  _id: string
  nombre: string
  unidadMedida: IUnit
  categoria: IIngredientCategories
  costoUnidad: number
  inStock: number
  minStock: number
  slug: string
  active: boolean
}

interface Props {
  ingredient: IIngredient
}

const IngredientAdminPage: FC<Props> = ({ ingredient }) => {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: ingredient,
  })

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'nombre') {
        const newSlug =
          value.nombre
            ?.trim()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
            .toLocaleLowerCase() || ''

        setValue('slug', newSlug)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, setValue])

  const onSubmitForm = async (form: FormData) => {
    setIsSaving(true)

    try {
      const { data } = await elBuenSaborApi({
        url: '/admin/ingredients',
        method: form._id ? 'PUT' : 'POST',
        data: form,
      })

      if (!form._id) {
        router.replace(`/admin/ingredients/${form.slug}`)
      } else {
        setIsSaving(false)
      }
      setIsSaved(true)
    } catch (error) {
      setIsSaved(false)
      setIsSaving(false)
    }
  }

  const showStatus = () => {
    setTimeout(() => {
      setIsSaved(false)
      router.back()
    }, 3500)
    return (
      <Alert severity='success' sx={{ mt: 2 }}>
        <AlertTitle>
          <strong>Ingrediente guardado</strong>
        </AlertTitle>
        El ingrediente se guardó correctamente
      </Alert>
    )
  }

  return (
    <AdminLayout
      title={'Ingrediente'}
      subTitle={`Editando: ${ingredient.nombre}`}
      icon={<DriveFileRenameOutline />}
    >
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
          <Button
            color='secondary'
            startIcon={<SaveOutlined />}
            sx={{ width: '150px' }}
            type='submit'
            disabled={isSaving}
          >
            Guardar
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label='Nombre'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('nombre', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />

            <TextField
              label='Stock actual'
              type='number'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('inStock', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label='Stock mínimo'
              type='number'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('minStock', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.minStock}
              helperText={errors.minStock?.message}
            />

            <TextField
              label='Costo Unidad'
              type='decimal'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('costoUnidad', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.costoUnidad}
              helperText={errors.costoUnidad?.message}
            />

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Unidad de Medida</FormLabel>
              <RadioGroup
                row
                value={getValues('unidadMedida')}
                onChange={({ target }) =>
                  setValue('unidadMedida', target.value as IUnit, {
                    shouldValidate: true,
                  })
                }
              >
                {validTypes.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color='secondary' />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Categoría</FormLabel>
              <RadioGroup
                row
                value={getValues('categoria')}
                onChange={({ target }) =>
                  setValue('categoria', target.value as IIngredientCategories, {
                    shouldValidate: true,
                  })
                }
              >
                {validCaterogies.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color='secondary' />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Slug - URL'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('slug', {
                required: 'Este campo es requerido',
                validate: (val) =>
                  val.trim().includes(' ')
                    ? 'No puede contener espacios'
                    : undefined,
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={getValues('active')}
                  onChange={({ target }) =>
                    setValue('active', target.checked, { shouldValidate: true })
                  }
                  color='secondary'
                />
              }
              label='Activo'
            />
          </Grid>
        </Grid>
      </form>
      {isSaved && showStatus()}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Button
          variant='contained'
          color='secondary'
          onClick={() => {
            if (isSaved) {
              router.back()
            } else {
              confirm(
                'Los cambios no han sido guardados.\n\n¿Está seguro de salir?'
              ) && router.back()
            }
          }}
        >
          Volver
        </Button>
      </Box>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = '' } = query

  let ingredient: IIngredient | null

  if (slug === 'new') {
    const tempIngredient = JSON.parse(JSON.stringify(new Ingredient()))
    delete tempIngredient._id
    ingredient = tempIngredient
  } else {
    ingredient = await dbIngredients.getIngredientBySlug(slug.toString())
  }

  if (!ingredient) {
    return {
      redirect: {
        destination: '/admin/ingredients',
        permanent: false,
      },
    }
  }

  return {
    props: {
      ingredient,
    },
  }
}

export default IngredientAdminPage
