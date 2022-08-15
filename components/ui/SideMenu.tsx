import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DinnerDining, EscalatorWarningOutlined, FastfoodOutlined, LiquorOutlined, LocalPizzaOutlined, LoginOutlined, SearchOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';
import { Icon } from '@iconify/react';
import { useContext, useState } from "react";
import { AuthContext, UiContext } from "../../context";
import { useRouter } from 'next/router';


export const SideMenu = () => {

    const router = useRouter();
    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
    const { user, isLoggedIn, logout } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState('')

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        navigateTo(`/search/${searchTerm}`)
    }

    const navigateTo = (url: string) => {
        toggleSideMenu();
        router.push(url);
    }

    return (
        <Drawer
            open={ isMenuOpen }
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
            onClose={ toggleSideMenu }
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>
                
                <List>

                    <ListItem>
                        <Input
                            autoFocus
                            value={ searchTerm }
                            onChange={ (e) => setSearchTerm(e.target.value) }
                            onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={ onSearchTerm }
                                    >
                                    <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    {
                        isLoggedIn && (
                            <>
                                <ListItem button onClick={() => navigateTo('/orders/history')}>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Mis Ordenes'} />
                                </ListItem>
                            </>
                        )
                    }



                    <ListItem 
                        button 
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/bebida')}
                    >
                        <ListItemIcon>
                            <LiquorOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Bebidas'} />
                    </ListItem>

                    <ListItem 
                        button 
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/hamburguesa')}
                    >
                        <ListItemIcon>
                            <FastfoodOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Hamburguesas'} />
                    </ListItem>

                    <ListItem 
                        button 
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/pizza')}
                    >
                        <ListItemIcon>
                            <LocalPizzaOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Pizzas'} />
                    </ListItem>

                    <ListItem 
                        button 
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/pancho')}
                    >
                        <ListItemIcon>
                            <Icon icon="mdi:food-hot-dog" width="25" />
                        </ListItemIcon>
                        <ListItemText primary={'Panchos'} />
                    </ListItem>

                    <ListItem 
                        button 
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/guarnicion')}
                    >
                        <ListItemIcon>
                            <Icon icon="ep:fries" width="27" />
                        </ListItemIcon>
                        <ListItemText primary={'Guarniciones'} />
                    </ListItem>

                    <ListItem 
                        button 
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/lomo')}
                    >
                        <ListItemIcon>
                            <Icon icon="icon-park-outline:bread" width="25"/>
                        </ListItemIcon>
                        <ListItemText primary={'Lomos'} />
                    </ListItem>

                    <ListItem 
                        button 
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/otro')}
                    >
                        <ListItemIcon>
                            <DinnerDining/>
                        </ListItemIcon>
                        <ListItemText primary={'Otros'} />
                    </ListItem>

                    {
                        isLoggedIn 
                        ? (
                            <ListItem button onClick={ logout }>
                                <ListItemIcon>
                                    <LoginOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Salir'} />
                            </ListItem>
                        ) 
                        : (
                            <ListItem button onClick={() => navigateTo(`/auth/login?p=${ router.asPath }`)}>
                                <ListItemIcon>
                                    <VpnKeyOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Ingresar'} />
                            </ListItem>
                        )
                    }                  

                    {
                        user?.role === 'Admin' && (
                            <>

                                <Divider />
                                <ListSubheader>Admin Panel</ListSubheader>

                                <ListItem button onClick={() => navigateTo('/admin/')}>
                                    <ListItemIcon>
                                        <DashboardOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItem>
                                <ListItem button onClick={() => navigateTo('/admin/products')}>
                                    <ListItemIcon>
                                        <CategoryOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Productos'} />
                                </ListItem>
                                <ListItem button onClick={() => navigateTo('/admin/ingredients')}>
                                    <ListItemIcon>
                                        <CategoryOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Ingredientes'} />
                                </ListItem>
                                <ListItem button onClick={() => navigateTo('/admin/orders')}>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Ordenes'} />
                                </ListItem>
                                <ListItem button onClick={() => navigateTo('/admin/users')}>
                                    <ListItemIcon>
                                        <AdminPanelSettings/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Usuarios'} />
                                </ListItem>
                            </>
                        )
                    }
                </List>
            </Box>
        </Drawer>
    )
}