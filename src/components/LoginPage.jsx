import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard')
        }
    }, [navigate])

    const handleLogin = async () => {
        if (!email) {
            toast.error('Enter the email')
            return;
        }
        if (!password) {
            toast.error('Enter the password')
            return;
        }
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.token);
            toast.success("Login Successful")
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } else {
            const errorData = await res.json();
            toast.error(errorData.error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Card sx={{ padding: 4, boxShadow: 20, borderRadius: 3, textAlign: 'center' }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>Login</Typography>
                        <TextField fullWidth margin="normal" label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <Button variant="contained" fullWidth onClick={handleLogin} sx={{ mt: 2 }}>Login</Button>
                        <Typography mt={2}>
                            Don't have an account? <Link href="/register">Sign Up</Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <ToastContainer />
        </Container>
    );
};

export default LoginPage;