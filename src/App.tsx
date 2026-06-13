import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { BrandingProvider } from '@/contexts/BrandingContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import FitnessLoader from '@/components/FitnessLoader';

const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const WalletPage = React.lazy(() => import('@/pages/WalletPage'));
const InvestorPage = React.lazy(() => import('@/pages/InvestorPage'));
const SearchPage = React.lazy(() => import('@/pages/SearchPage'));
const BookingsPage = React.lazy(() => import('@/pages/BookingsPage'));
const ClientsPage = React.lazy(() => import('@/pages/ClientsPage'));
const WorkoutPlansPage = React.lazy(() => import('@/pages/WorkoutPlansPage'));
const SeedPage = React.lazy(() => import('@/pages/SeedPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PitchPage = lazy(() => import("./pages/PitchPage"));
const CreditsPage = lazy(() => import("./pages/CreditsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));


const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-50">
    <FitnessLoader />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <BrandingProvider>
            <Router>
              <div className="App">
                <Toaster />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/business.html" element={<InvestorPage />} />
                  <Route path="/investors" element={<InvestorPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/pitch" element={<PitchPage />} />
                  <Route path="/credits" element={<CreditsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  {/* Draft Route removed */}

                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/wallet" element={
                    <ProtectedRoute>
                      <WalletPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/investors" element={<InvestorPage />} />
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
                  <Route path="/clients" element={
                    <ProtectedRoute>
                      <ClientsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/workout-plans" element={
                    <ProtectedRoute>
                      <WorkoutPlansPage />
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
        </BrandingProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider >
  );
}

export default App;
