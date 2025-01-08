import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Link, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');

        let isValid = true;
        if (!email) {
            setEmailError('Enter the email');
            isValid = false;
        }
        if (!password) {
            setPasswordError('Enter the password');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                toast.success("Login Successful");
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                const errorData = await res.json();
                toast.error(errorData.error);
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    background: 'linear-gradient(to bottom right, #6366F1, #A855F7)',
                    padding: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "90vh"
                }}
            >
                <Card sx={{ width: '100%', maxWidth: '400px', borderRadius: 2 }}>
                    <CardContent sx={{ padding: 4 }}>
                        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                            Login
                        </Typography>
                        <Typography variant="body2" gutterBottom align="center" color="textSecondary">
                            Enter your email and password to login
                        </Typography>
                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!emailError}
                                helperText={emailError}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!passwordError}
                                helperText={passwordError}
                            />
                            <Button
                                variant="contained"
                                fullWidth
                                type="submit"
                                disabled={isLoading}
                                sx={{ mt: 2, mb: 2, height: '48px' }}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                        <Typography align="center">
                            Don't have an account?{' '}
                            <Link href="/register" underline="hover">
                                Sign up
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <ToastContainer />
        </Container>
    );
};

export default LoginPage;
