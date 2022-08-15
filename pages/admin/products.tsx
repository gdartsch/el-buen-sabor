import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React from 'react'
import useSWR from 'swr';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { IProduct } from '../../interfaces';
import NextLink from 'next/link';

const columns: GridColDef[] = [
    { 
        field: 'img', 
        headerName: 'Foto',
        renderCell: ({row}: GridValueGetterParams) => {
            return (
                <a href={`/product/${row.slug}`} target="_blank" rel='noreferrer'>
                    <CardMedia
                        component={'img'}
                        alt={row.name}
                        className='fadeIn'
                        image={ row.img }
                    />
                </a>
            )
        }
    },
    { 
        field: 'title', 
        headerName: 'Producto',
         width: 250,
        renderCell: ({row}: GridValueGetterParams) => {
            return (
                <NextLink href={`/admin/products/${row.slug}`} passHref>
                    <Link underline='always'>
                        {row.title}
                    </Link>
                </NextLink>
            )
        }
    },
    { field: 'category', headerName: 'Categoría' },
    { field: 'inStock', headerName: 'Inventario'},
    { field: 'price', headerName: 'Precio', width: 250},
];

const ProductsPage = () => {

    const {data, error} = useSWR<IProduct[]>('/api/admin/products');

    if(!data && !error) {
        return <></>
    }

    const rows = (data! || []).map(product => ({
        id: product._id,
        img: product.imagen,
        title: product.nombre,
        category: product.categoria,
        price: product.precio,
        slug: product.slug
    }));

    return (
        <AdminLayout
            title={`Productos (${data?.length})`}
            subTitle='Mantenimiento de productos'
            icon={<CategoryOutlined/>}
        >
            <Box display={'flex'} justifyContent={'end'} sx={{ mb: 2}}>
                <Button
                    startIcon={<AddOutlined/>}
                    color={'secondary'}
                    href={'/admin/products/new'}
                >
                    Crear Producto
                </Button>    
            </Box>

            <Grid container className='fadeIn'>
                <Grid item xs={12} sx ={{ height:650, width:'100%'}}>
                    <DataGrid
                        rows={ rows }
                        columns={ columns }
                        pageSize={ 10 }
                        rowsPerPageOptions={ [10] }
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export default ProductsPage