import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Toolbar, CssBaseline, AppBar, Box, useTheme, useMediaQuery, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../assets/logo.png';
import { toast } from 'react-toastify';

const drawerWidth = 220;
const drawerWidthCollapsed = 60;

const Layout = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:700px)');
    const drawerWidthDynamic = isMobile ? drawerWidthCollapsed : drawerWidth;

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Products', icon: <InventoryIcon />, path: '/products' },
        { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
    ];

    const logoutHandler = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        setTimeout(() => {
            navigate('/');
        }, 1500);
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidthDynamic}px)`,
                    ml: `${drawerWidthDynamic}px`,
                    bgcolor: theme.palette.primary.main,
                    boxShadow: 3,
                    transition: 'margin 0.3s, width 0.3s',
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        aria-label="logout"
                        edge="end"
                        onClick={logoutHandler}
                        sx={{
                            '&:hover': {
                                bgcolor: theme.palette.primary.dark,
                            },
                        }}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidthDynamic,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidthDynamic,
                        boxSizing: 'border-box',
                        bgcolor: theme.palette.background.default,
                        boxShadow: 2,
                        overflowX: 'hidden',
                        transition: 'width 0.3s',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isMobile ? 'center' : 'flex-start',
                        padding: theme.spacing(2),
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            width: '30px',
                            marginRight: isMobile ? 0 : theme.spacing(2),
                        }}
                    />
                    {!isMobile && (
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            IMS
                        </Typography>
                    )}
                </Box>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            component={Link}
                            to={item.path}
                            button
                            key={item.text}
                            sx={{
                                justifyContent: isMobile ? 'center' : 'flex-start',
                                mb: 2,
                                borderRadius: 1,
                                color: location.pathname === item.path
                                    ? theme.palette.primary.main
                                    : theme.palette.text.primary,
                                bgcolor: location.pathname === item.path
                                    ? theme.palette.action.selected
                                    : 'transparent',
                                '&:hover': {
                                    bgcolor: theme.palette.primary.main,
                                    color: 'white',
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                },
                                '& .MuiListItemIcon-root': {
                                    color: location.pathname === item.path
                                        ? theme.palette.primary.main
                                        : theme.palette.text.primary,
                                    minWidth: 0,
                                    marginRight: isMobile ? 0 : theme.spacing(2),
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            {!isMobile && <ListItemText primary={item.text} />}
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: theme.palette.background.default,
                    p: 3,
                    mt: 8,
                    transition: 'margin 0.3s',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
