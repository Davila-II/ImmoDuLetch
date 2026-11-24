import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // La session est en cours de restauration : on ne redirige pas encore
  if (loading) {
    return <div className="max-w-md mx-auto my-20 text-center text-sm text-slate-500">Chargement…</div>;
  }

  if (!user) {
    // « from » permet à la page de connexion de ramener l'utilisateur où il voulait aller
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}