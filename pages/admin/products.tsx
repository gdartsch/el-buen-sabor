import { AddOutlined, CategoryOutlined } from '@mui/icons-material'
import { Box, Button, CardMedia, Grid, Link } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { AdminLayout } from '../../components/layouts/AdminLayout'
import { IProduct } from '../../interfaces'

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Foto',
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
          <CardMedia
            component={'img'}
            alt={row.name}
            className='fadeIn'
            image={row.img}
          />
        </a>
      )
    },
  },
  {
    field: 'title',
    headerName: 'Producto',
    width: 200,
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref>
          <Link underline='none'>{row.title}</Link>
        </NextLink>
      )
    },
  },
  { field: 'category', headerName: 'Categoría', width: 150 },
  { field: 'inStock', headerName: 'Inventario', width: 150 },
  { field: 'price', headerName: 'Precio', width: 150 },
]

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products')
  const router = useRouter()

  if (!data && !error) {
    return <></>
  }

  const rows = (data! || []).map((product) => ({
    id: product._id,
    img: product.imagen,
    title: product.nombre,
    category: product.categoria,
    price: product.precio,
    slug: product.slug,
  }))

  return (
    <AdminLayout
      title={`Productos (${data?.length})`}
      subTitle='Mantenimiento de productos'
      icon={<CategoryOutlined />}
    >
      <Box display={'flex'} justifyContent={'end'} sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color={'secondary'}
          href={'/admin/products/new'}
        >
          Crear Producto
        </Button>
      </Box>

      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            onRowClick={(params) => {
              router.push(`/admin/products/${params.row.slug}`)
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

export default ProductsPage
