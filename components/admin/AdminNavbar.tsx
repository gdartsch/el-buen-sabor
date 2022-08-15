import NextLink from 'next/link';
import { AppBar, Box, Link, Toolbar, Typography, Button } from '@mui/material';
import { UiContext } from '../../context';
import { useContext } from 'react';


export const AdminNavbar = () => {

    const { toggleSideMenu } = useContext(UiContext);

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Link display='flex' alignItems='center' underline='none'>
                        <Typography variant='h6'>El Buen Sabor |</Typography>
                        <Typography sx={{ ml: 0.5 }}>DBZ</Typography>
                    </Link>
                </NextLink>
                
                <Box flex={1}/>

                <Button onClick={toggleSideMenu}>
                    Menú
                </Button>

            </Toolbar>
        </AppBar>
    )
}