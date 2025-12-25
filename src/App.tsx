import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const SearchPage = React.lazy(() => import('@/pages/SearchPage'));
const BookingsPage = React.lazy(() => import('@/pages/BookingsPage'));
const SeedPage = React.lazy(() => import('@/pages/SeedPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      <p className="text-sm text-slate-500">Caricamento...</p>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/business.html" element={<Navigate to="/business.html" replace />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                } />
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <BookingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/seed" element={<SeedPage />} />
                <Route path="/profile/:id" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
              </Routes>

            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
