import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';

import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountDashboardPage from './pages/AccountDashboardPage';
import SubmitPropertyPage from './pages/SubmitPropertyPage';
import AdminPage from './pages/AdminPage';
import ConditionsPage from './pages/ConditionsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';

// Pages réservées aux utilisateurs connectés
const protectedSubmit = (
  <RequireAuth>
    <SubmitPropertyPage />
  </RequireAuth>
);

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:reference" element={<PropertyDetailPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/my-account"
                  element={
                    <RequireAuth>
                      <AccountDashboardPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RequireAdmin>
                      <AdminPage />
                    </RequireAdmin>
                  }
                />
                <Route path="/deposer" element={protectedSubmit} />
                <Route path="/deposer/:reference" element={protectedSubmit} />
                {/* Alias de compatibilité ascendante */}
                <Route path="/submit" element={protectedSubmit} />
                <Route path="/submit/:reference" element={protectedSubmit} />
                <Route path="/conditions" element={<ConditionsPage />} />
                <Route path="/confidentialite" element={<PrivacyPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
