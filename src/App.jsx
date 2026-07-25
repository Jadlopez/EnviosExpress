// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importación de Páginas
import Login from './pages/auth/Login';
import TrackingView from './pages/client/TrackingView';
import DriverDashboard from './pages/driver/DriverDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Register from './pages/auth/Register';



// Componente simple para proteger rutas según el rol o si está logueado
 const ProtectedRoute = ({ children, allowedRoles }) => {
   const token = localStorage.getItem('token');
   const rol = localStorage.getItem('rol');

  if (!token) {
     return <Navigate to="/" replace />;
   }

   if (allowedRoles && !allowedRoles.includes(rol)) {
     return <Navigate to="/" replace />;
   }

   return children;
 };

export default function App() {
  return (
    
    <Router>
       <Routes>
        {/* Ruta Pública: Login */}
        <Route path="/" element={<Login />} />

        {/* Ruta Pública: Portal de Rastreo por Código de Guía */}
        <Route path="/rastreo" element={<TrackingView />} />

        {/* Rutas Protegidas para Conductores */}
        <Route 
          path="/driver" 
          element={
            <ProtectedRoute allowedRoles={['CONDUCTOR', 'ADMIN']}>
              <DriverDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Rutas Protegidas para Administradores / Despachadores */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DESPACHADOR']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Redirección por defecto si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" replace />} />

        
        <Route path="/register" element={<Register />} />
      </Routes>
     
      
    </Router>
    
  );
}