import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard')
        }
    }, [navigate])

    const handleRegister = async () => {
        if (!email) {
            toast.error('Enter the email')
            return;
        }
        if (!password) {
            toast.error('Enter the password')
            return;
        }
        if (!confirmPassword) {
            toast.error('Enter the ConfirmPassword')
            return;
        }
        if (password !== confirmPassword) {
            toast.error('ConfirmPassword should be same as Password')
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
                console.log(res.statusText);
                toast.success(`User Registered Successfully`)
                setTimeout(() => {
                    navigate('/')
                }, 2000);
            } else {
                const errorData = await res.json()
                toast.error(errorData.error);
            }
        } catch (error) {
            toast.error("Network error, please try again later.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box display='flex' justifyContent='center' alignItems= 'center' minHeight='100vh'>
                <Card sx={{padding: 5, boxShadow: 20, borderRadius: 3, textAlign: 'center'}}>
                    <CardContent>
                        <Typography variant="h4">Register</Typography>
                        <TextField fullWidth margin="normal" label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <TextField fullWidth margin="normal" label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        <Button variant="contained" fullWidth onClick={handleRegister}>Register</Button>
                        <Typography mt={2}>
                            Already have an account? <Link href="/">Login</Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <ToastContainer />
        </Container>
    );
};

export default RegisterPage;