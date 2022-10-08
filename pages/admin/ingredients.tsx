import { AddOutlined, CategoryOutlined } from '@mui/icons-material'
import { Box, Button, Grid, Link } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { AdminLayout } from '../../components/layouts/AdminLayout'
import { IIngredient } from '../../interfaces'

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Ingrediente',
    width: 250,
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <NextLink href={`/admin/ingredients/${row.slug}`} passHref>
          <Link underline='always'>{row.title}</Link>
        </NextLink>
      )
    },
  },
  { field: 'category', headerName: 'Categoría' },
  { field: 'inStock', headerName: 'Inventario' },
  { field: 'price', headerName: 'Precio', width: 250 },
]

const IngredientsPage = () => {
  const { data, error } = useSWR<IIngredient[]>('/api/admin/ingredients')
  const router = useRouter()

  if (!data && !error) {
    return <></>
  }

  const rows = (data! || []).map((ingredient) => ({
    id: ingredient._id,
    title: ingredient.nombre,
    category: ingredient.categoria,
    price: ingredient.costoUnidad,
    inStock: ingredient.inStock,
    slug: ingredient.slug,
  }))

  return (
    <AdminLayout
      title={`Ingredientes (${data?.length})`}
      subTitle='Mantenimiento de ingredientes'
      icon={<CategoryOutlined />}
    >
      <Box display={'flex'} justifyContent={'end'} sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color={'secondary'}
          href={'/admin/ingredients/new'}
        >
          Crear Ingrediente
        </Button>
      </Box>

      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            rowsPerPageOptions={[10]}
            onRowClick={(params) => {
              router.push(`/admin/ingredients/${params.row.slug}`)
            }}
            sx={{
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
              },
            }}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default IngredientsPage
