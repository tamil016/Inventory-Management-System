import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Link, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Enter the email');
            return;
        }
        if (!password) {
            toast.error('Enter the password');
            return;
        }
        if (!confirmPassword) {
            toast.error('Enter the Confirm Password');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Confirm Password should be same as Password');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
                toast.success('User Registered Successfully');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                const errorData = await res.json();
                toast.error(errorData.error);
            }
        } catch (error) {
            toast.error("Network error, please try again later.");
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
                    minHeight: "90vh",
                }}
            >
                <Card sx={{ width: '100%', maxWidth: '400px', borderRadius: 2 }}>
                    <CardContent sx={{ padding: 4 }}>
                        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                            Create an account
                        </Typography>
                        <Typography variant="body2" gutterBottom align="center" color="textSecondary">
                            Enter your email and password to register
                        </Typography>
                        <form onSubmit={handleRegister}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Confirm Password"
                                type="password"
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                fullWidth
                                type="submit"
                                disabled={isLoading}
                                sx={{ mt: 2, mb: 2, height: '48px' }}
                            >
                                {isLoading ? 'Registering...' : 'Register'}
                            </Button>
                        </form>
                        <Typography align="center">
                            Already have an account?{' '}
                            <Link href="/" underline="hover">
                                Login
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <ToastContainer />
        </Container>
    );
};

export default RegisterPage;