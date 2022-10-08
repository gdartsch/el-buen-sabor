import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { CartContext, UiContext } from '../../context'

export const Navbar = () => {
  const { asPath, push } = useRouter()
  const { toggleSideMenu } = useContext(UiContext)
  const { numberOfItems } = useContext(CartContext)

  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return
    push(`/search/${searchTerm}`)
  }

  return (
    <AppBar>
      <Toolbar>
        <NextLink href='/' passHref>
          <Link display='flex' alignItems='center' underline='none'>
            <Typography variant='h6'>El Buen Sabor |</Typography>
            <Typography sx={{ ml: 0.5 }}>DBZ</Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Box
          sx={{
            display: isSearchVisible
              ? 'none'
              : { xs: 'none', sm: 'none', md: 'block' },
          }}
          className='fadeIn'
        >
          <NextLink href='/category/bebida' passHref>
            <Link underline='none'>
              <Button
                style={{
                  backgroundColor:
                    asPath === '/category/bebida' ? 'black' : 'primary',
                }}
                color={asPath === '/category/bebida' ? 'info' : 'primary'}
              >
                Bebidas
              </Button>
            </Link>
          </NextLink>
          <NextLink href='/category/hamburguesa' passHref>
            <Link underline='none'>
              <Button
                style={{
                  backgroundColor:
                    asPath === '/category/hamburguesa' ? 'black' : 'primary',
                }}
                color={asPath === '/category/hamburguesa' ? 'info' : 'primary'}
              >
                Hamburguesas
              </Button>
            </Link>
          </NextLink>
          <NextLink href='/category/pizza' passHref>
            <Link underline='none'>
              <Button
                style={{
                  backgroundColor:
                    asPath === '/category/pizza' ? 'black' : 'primary',
                }}
                color={asPath === '/category/pizza' ? 'info' : 'primary'}
              >
                Pizzas
              </Button>
            </Link>
          </NextLink>
          <NextLink href='/category/pancho' passHref>
            <Link underline='none'>
              <Button
                style={{
                  backgroundColor:
                    asPath === '/category/pancho' ? 'black' : 'primary',
                }}
                color={asPath === '/category/pancho' ? 'info' : 'primary'}
              >
                Panchos
              </Button>
            </Link>
          </NextLink>
          <NextLink href='/category/guarnicion' passHref>
            <Link underline='none'>
              <Button
                style={{
                  backgroundColor:
                    asPath === '/category/guarnicion' ? 'black' : 'primary',
                }}
                color={asPath === '/category/guarnicion' ? 'info' : 'primary'}
              >
                Guarniciones
              </Button>
            </Link>
          </NextLink>
          <NextLink href='/category/lomo' passHref>
            <Link underline='none'>
              <Button
                style={{
                  backgroundColor:
                    asPath === '/category/lomo' ? 'black' : 'primary',
                }}
                color={asPath === '/category/lomo' ? 'info' : 'primary'}
              >
                Lomos
              </Button>
            </Link>
          </NextLink>
          <NextLink href='/category/otro' passHref>
            <Link underline='none'>
              <Button
                style={{
                  backgroundColor:
                    asPath === '/category/otro' ? 'black' : 'primary',
                }}
                color={asPath === '/category/otro' ? 'info' : 'primary'}
              >
                Otros
              </Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />

        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href='/cart' passHref>
          <Link underline='none'>
            <IconButton>
              <Badge
                badgeContent={numberOfItems > 9 ? '+9' : numberOfItems}
                color='secondary'
              >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  )
}
