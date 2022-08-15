import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';
import { Button, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import useSWR from 'swr';
import { DashboardSummaryResponse } from '../../interfaces';
import { format } from '../../utils/currency';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useExcelDownloder } from 'react-xls';

const DashboardPage = () => {

    const {data, error} = useSWR<DashboardSummaryResponse>('/api/admin/dashboard');
    const { ExcelDownloder, Type } = useExcelDownloder();


    if (!error && !data) {
        return <></>
    }

    if (error) {
        <Typography variant='h3'>Error al cargar la información</Typography>
    }

    const {
        products,
        orders,
        ingredients,
    } = data!;

    const totalProductsFromOrders = orders.map((order: any) => order.orderItems);
    
    let cost = 0;

    for(let i = 0; i < totalProductsFromOrders.length; i++){
        for(let j = 0; j < products.length; j++){
            if(totalProductsFromOrders[i][0].nombre === products[j].nombre){
                for(let k = 0; k < ingredients.length; k++){
                    for(let l = 0; l < products[j].recipe.length; l++){
                        if(products[j].recipe[l][0] === ingredients[k].nombre){
                            cost += products[j].recipe[l][1] * ingredients[k].costoUnidad * totalProductsFromOrders[i][0].cantidad;
                        }
                    }
                }              
            }
        }
    }

    const totalPaidOrders = orders.filter((order: { isPaid: any; }) => order.isPaid === true);
    const lastMonthOrders = totalPaidOrders.filter((order: { createdAt: string | number | Date; }) => new Date(order.createdAt) > new Date(new Date().setMonth(new Date().getMonth() - 1)));
    let costLastMonth = 0;

    const totalProductsFromOrdersLastMonth = lastMonthOrders.map((order: any) => order.orderItems);

    for(let i = 0; i < totalProductsFromOrdersLastMonth.length; i++){
        for(let j = 0; j < products.length; j++){
            if(totalProductsFromOrdersLastMonth[i][0].nombre === products[j].nombre){
                for(let k = 0; k < ingredients.length; k++){
                    for(let l = 0; l < products[j].recipe.length; l++){
                        if(products[j].recipe[l][0] === ingredients[k].nombre){
                            costLastMonth += products[j].recipe[l][1] * ingredients[k].costoUnidad * totalProductsFromOrdersLastMonth[i][0].cantidad;
                        }
                    }
                }              
            }
        }
    }

    const totalRawEarnings = totalPaidOrders.reduce((acc: any, order: { total: any; }) => acc + order.total, 0);
    const rawEarningsLastMonth = lastMonthOrders.reduce((acc: any, order: { total: any; }) => acc + order.total, 0);
    const earnings = totalRawEarnings - cost;
    const earningsLastMonth = rawEarningsLastMonth.toFixed(2) - costLastMonth;

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 300},
        {field: 'nombre', headerName: 'Nombre', width: 300},
        {field: 'cantidad', headerName: 'Cantidad', width: 300},
    ];

    let topProductsMonth = [];

    for(let i = 0; i < totalProductsFromOrdersLastMonth.length; i++){
        let exists = false;
        for(let j = 0; j < topProductsMonth.length; j++){
            if(topProductsMonth[j].nombre === totalProductsFromOrdersLastMonth[i][0].nombre){
                topProductsMonth[j].cantidad += totalProductsFromOrdersLastMonth[i][0].cantidad;
                exists = true;
            }   
        }
        if(exists === false){
            topProductsMonth.push({
                id: totalProductsFromOrdersLastMonth[i][0]._id,
                nombre: totalProductsFromOrdersLastMonth[i][0].nombre,
                cantidad: totalProductsFromOrdersLastMonth[i][0].cantidad,
            });
        }   
    }

    const rows = topProductsMonth.map((order, idx) => ({
        id: order.id,
        nombre: order.nombre,
        cantidad: order.cantidad,
    }))

    const dataProducts: Array<{[key: string]: any}> = rows.map(row => ({
        id: row.id,
        nombre: row.nombre,
        cantidad: row.cantidad,
        gananciasDelMes: earningsLastMonth,
        gananciasHistorico: earnings,
    }));

    const dataEarnings = {
        gananciasDelMes: earningsLastMonth,
        gananciasHistorico: earnings,
    };

    const dataExcel = {
        //two wokksheets
        Ganancias: [
            {
                gananciasDelMes: earningsLastMonth,
                gananciasHistorico: earnings,
            }
        ],
        TopProductos: [
            ...rows.map(row => ({
                id: row.id,
                nombre: row.nombre,
                cantidad: row.cantidad,
            }))
        ],
    };

  return (
    <AdminLayout
        title='Dashboard'
        subTitle='Estadísticas generales'
        icon={<DashboardOutlined/>}
    >
        <Grid container spacing={2}>
            
            <SummaryTile 
                title={earningsLastMonth}
                subTitle='Ganancias del mes'
                icon={<AttachMoneyOutlined color='success' sx={{fontsize: 40}}/>}
            />

            <SummaryTile 
                title={earnings}
                subTitle='Histórico de ganancias'
                icon={<AttachMoneyOutlined color='success' sx={{fontsize: 40}}/>}
            />

            <Typography variant='h1' component='h1'>Ranking de productos vendidos en el último mes</Typography>

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
            <Button>
                    <ExcelDownloder
                        data={dataExcel}
                        filename={'Estadisticas'}
                        type={Type.Button} // or type={'button'}
                    >
                        Descargar en formato de hoja de cálculo
                    </ExcelDownloder>
                </Button>
        </Grid>
    </AdminLayout>
  )
}

export default DashboardPage