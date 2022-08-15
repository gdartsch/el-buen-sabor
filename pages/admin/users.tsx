import { PeopleOutline } from '@mui/icons-material'
import { Grid, MenuItem, Select } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/layouts'
import useSWR from 'swr';
import { IRole, IUser } from '../../interfaces';
import { elBuenSaborApi } from '../../api';

const UsersPage = () => {

    const {data, error} = useSWR<IUser[]>('/api/admin/users');

    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
      if (data) {
        setUsers(data);
      }
    }, [data])
    

    if (!error && !data) {
        return <></>
    }

    const onRoleUpdated = async (userId: string, newRole: IRole) => {

        const previousUsers = users.map( user => ({...user}));
        const updatedUsers = users.map(user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers);

        try {
            await elBuenSaborApi.put('/admin/users', { userId, role: newRole });
        } catch (error) {
            setUsers(previousUsers);
            alert('No se pudo actualizar el rol');
        }

    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        { 
            field: 'role', 
            headerName: 'Rol', 
            width: 300,
            renderCell: ({row}: GridValueGetterParams) => {
                return (
                    <Select
                        value={row.role}
                        label="Rol"
                        onChange={ ({target}) => {onRoleUpdated(row.id, target.value)}}
                        sx={{widht: '300px'}}
                    >
                        <MenuItem value='Admin'>Admin</MenuItem>
                        <MenuItem value='User'>Client</MenuItem>
                        <MenuItem value='Chef'>Chef</MenuItem>
                        <MenuItem value='Delivery'>Delivery</MenuItem>
                        <MenuItem value='Cashier'>Cashier</MenuItem>
                    </Select>
                )
            },
        },
    ];

    const rows = users.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    }))

    return (
        <AdminLayout
            title='Usuarios'
            subTitle='Mantenimiento de usuarios'
            icon={<PeopleOutline/>}
        >
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

export default UsersPage