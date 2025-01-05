import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Toolbar, CssBaseline, AppBar, Box, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import logo from '../assets/logo.png'

const drawerWidth = 180;

const Layout = () => {
    const theme = useTheme();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Products', icon: <InventoryIcon />, path: '/products' },
        { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    bgcolor: 'text.disabled',
                    borderRadius : '10px',
                    marginLeft : '2px'
                }}
            >
                <Toolbar>
                    <Typography variant="h5" noWrap sx={{ color: 'background.paper', p: 2 }}>
                        Inventory Management System
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: theme.palette.background.paper,
                    }
                }}
                variant="permanent"
                anchor="left"
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '10px',
                        padding: '5px',
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: '30%', marginBottom: '5px' }}
                    />
                    <Typography variant="h4" sx={{ color: theme.palette.text.primary, fontSize : 'bold', ml:2}}>
                        IMS
                    </Typography>
                </Box>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            component={Link}
                            to={item.path}
                            button
                            key={item.text}
                            sx={{
                                mb: 5,
                                mt: 2,
                                color: location.pathname === item.path
                                    ? theme.palette.primary.main
                                    : theme.palette.text.primary,
                                '&:hover': {
                                    bgcolor: 'text.disabled',
                                    color: 'background.paper',
                                    borderRadius: '10px'
                                },
                                '& .MuiListItemIcon-root': {
                                    color: location.pathname === item.path
                                        ? theme.palette.primary.main
                                        : theme.palette.text.primary,
                                }
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: theme.palette.background.default,
                    p: 5,
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
