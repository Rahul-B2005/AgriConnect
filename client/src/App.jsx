
import React from 'react';
import {Routes,Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home'; import Login from './pages/Login'; import Register from './pages/Register';
import Marketplace from './pages/Marketplace'; import Dashboard from './pages/Dashboard'; import Orders from './pages/Orders';

export default function App(){
 return <><Navbar/><Routes>
  <Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
  <Route path="/market" element={<Marketplace/>}/>
  <Route path="/dashboard" element={<ProtectedRoute role="farmer"><Dashboard/></ProtectedRoute>}/>
  <Route path="/orders" element={<ProtectedRoute role="buyer"><Orders/></ProtectedRoute>}/>
 </Routes></>
}
