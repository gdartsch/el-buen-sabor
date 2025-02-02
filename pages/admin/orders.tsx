import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Button, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { useExcelDownloder } from 'react-xls'
import useSWR from 'swr'
import { elBuenSaborApi } from '../../api'
import RowOrderPaymentState from '../../components/admin/RowOrderPaymentState'
import RowOrderState from '../../components/admin/RowOrderState'
import { AdminLayout } from '../../components/layouts/AdminLayout'
import { IOrder, IOrderState } from '../../interfaces'

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders')
  const [orders, setOrders] = useState<IOrder[]>([])
  const { ExcelDownloder, Type } = useExcelDownloder()

  useEffect(() => {
    if (data) {
      setOrders(data)
    }
  }, [data])

  const onStatusUpdated = async (
    orderId: string,
    newStatus: IOrderState,
    newPayStatus: boolean
  ) => {
    const previousOrders = orders.map((order) => ({ ...order }))
    const updatedOrders = orders.map((order) => ({
      ...order,
      state: orderId === order._id ? newStatus : order.currentState,
      paymentState: orderId === order._id ? newPayStatus : order.isPaid,
    }))

    setOrders(updatedOrders)

    try {
      await elBuenSaborApi.put('/admin/orders', {
        orderId: orderId,
        currentState: newStatus,
        paymentState: newPayStatus,
      })
    } catch (error) {
      setOrders(previousOrders)
      alert('No se pudo actualizar la orden')
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 250 },
    { field: 'name', headerName: 'Nombre Cliente', width: 150 },
    { field: 'total', headerName: 'Monto total', width: 100 },
    {
      field: 'role',
      headerName: 'Estado del pedido',
      width: 150,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <RowOrderState
            order={row as IOrder}
            onSatusUpdated={onStatusUpdated}
          />
        )
      },
    },
    {
      field: 'isPaid',
      headerName: 'Pagado',
      width: 150,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <RowOrderPaymentState
            order={row as IOrder}
            onStatusUpdated={onStatusUpdated}
          />
        )
      },
    },
    {
      field: 'inStock',
      headerName: 'No. Productos',
      align: 'center',
      width: 125,
    },
    {
      field: 'check',
      headerName: 'Ver orden',
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>
            Ver orden
          </a>
        )
      },
    },
    { field: 'createdAt', headerName: 'Creada en', width: 300 },
    { field: 'paymentMethod', headerName: 'Metodo de pago', width: 200 },
  ]

  if (!data && !error) {
    return <></>
  }

  const rows = (data! || []).map((order) => ({
    id: order._id,
    name: `${order.sendAddress.firstName} ${order.sendAddress.lastName}`,
    total: order.total,
    currentState: order.currentState,
    isPaid: order.isPaid,
    inStock: order.numberOfItems,
    createdAt: order.createdAt,
  }))

  const dataForExcel: Array<{ [key: string]: any }> = rows.map((row) => ({
    id: row.id,
    cliente: row.name,
    total: row.total,
    estadoActual: row.currentState.toString(),
    pagado: row.isPaid ? 'Pagado' : 'No Pagado',
    cantidadProductos: row.inStock,
    creacionPedido: row.createdAt,
  }))

  const dataExcel = {
    data: dataForExcel,
    columns: [
      { header: 'Orden ID', key: 'id' },
      { header: 'Nombre Cliente', key: 'cliente' },
      { header: 'Monto total', key: 'total' },
      { header: 'Estado del pedido', key: 'estadoActual' },
      { header: 'Pagado', key: 'pagado' },
      { header: 'No. Productos', key: 'cantidadProductos' },
      { header: 'Creada en', key: 'creacionPedido' },
    ],
  }

  return (
    <AdminLayout
      title='Ordenes'
      subTitle='Mantenimiento de ordenes'
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 450, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
        <Button>
          <ExcelDownloder
            data={dataExcel}
            filename={'Ordenes'}
            type='button' // or type={'button'}
          >
            Descargar en formato de hoja de cálculo
          </ExcelDownloder>
        </Button>
      </Grid>
    </AdminLayout>
  )
}

export default OrdersPage
