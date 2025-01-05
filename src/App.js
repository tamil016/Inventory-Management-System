import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './pages/Dashboard';
import Layout from './pages/Layout';
import Products from './pages/Products';
import Categories from './pages/Categories';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path='/' element={<Layout/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/products' element={<Products />} />
        <Route path='/categories' element={<Categories />} />
      </Route>
    </Routes>
  );
};

export default App;