import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/contexts/BrandingContext';

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Dumbbell, LayoutDashboard, Search, Calendar, Wallet, User } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { isFirebaseConfigured, HIDE_DEMO_BANNER } from '@/utils/env';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout = ({ children, showNavigation = true }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { brandNameFull, toggleBrandName } = useBranding();
  const isDemoMode = !isFirebaseConfigured() && !HIDE_DEMO_BANNER;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 animate-gradient-x flex flex-col">
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-center py-2 px-4 text-xs font-semibold tracking-wide flex justify-center items-center gap-2 shadow-inner relative z-50">
          <span className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            ⚠️ <strong>Modalità Demo Locale Attiva</strong>: I dati sono salvati nel browser.
            <button 
              onClick={() => {
                if (confirm("Vuoi resettare il database locale ai dati di partenza? Questo eliminerà tutte le modifiche correnti.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }} 
              className="underline ml-2 hover:text-amber-100 transition-colors font-bold"
            >
              [Resetta Dati]
            </button>
          </span>
        </div>
      )}
      {showNavigation && (
        <nav className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center group">
                <div 
                  className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-lime-500 rounded-lg mr-3 flex items-center justify-center cursor-pointer hover:opacity-85 transition-opacity"
                  onClick={() => navigate('/')}
                >
                  <span className="text-white font-bold text-sm">FF</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBrandName();
                    }}
                    className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-lime-500 bg-clip-text text-transparent select-none cursor-pointer hover:opacity-80 transition-opacity flex items-center"
                    title="Clicca per cambiare brand name (Demo)"
                  >
                    {brandNameFull}
                  </span>
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBrandName();
                    }}
                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-lime-100 text-lime-800 animate-pulse cursor-pointer select-none"
                  >
                    Demo Switch
                  </span>
                </div>
              </div>

              {/* Desktop Navigation */}
              {user && (
                <div className="hidden md:flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className={location.pathname === '/dashboard' ? 'bg-slate-100' : ''}
                  >
                    {t('nav.dashboard')}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/search')}
                    className={location.pathname === '/search' ? 'bg-slate-100' : ''}
                  >
                    {t('nav.search')}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/bookings')}
                    className={location.pathname === '/bookings' ? 'bg-slate-100' : ''}
                  >
                    {t('nav.bookings')}
                  </Button>
                  <LanguageSwitcher />
                </div>
              )}

              <div className="hidden md:flex items-center space-x-4">
                {location.pathname === '/' ? (
                  <>
                    <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50" onClick={() => navigate('/login')}>
                      {t('nav.login') || "ACCEDI"}
                    </Button>
                    <Button onClick={() => navigate('/register')} className="gradient-primary text-white">
                      {t('nav.register')}
                    </Button>
                    <Link
                      to="/contact"
                      className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {t('nav.contact')}
                    </Link>
                    <Link
                      to="/pitch"
                      className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {t('nav.vision')}
                    </Link>
                    <LanguageSwitcher />
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50" onClick={() => navigate('/login')}>
                      {t('nav.login') || "ACCEDI"}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/')}>
                      {t('nav.home')}
                    </Button>
                    <Link
                      to="/pitch"
                      className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {t('nav.vision')}
                    </Link>
                    <Link
                      to="/contact"
                      className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {t('nav.contact')}
                    </Link>
                    <LanguageSwitcher />
                  </>
                )}
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden flex items-center">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="flex flex-col space-y-4 mt-8">
                      {user ? (
                        <>
                          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                            {t('nav.dashboard')}
                          </Button>
                          <Button variant="ghost" onClick={() => navigate('/search')}>
                            {t('nav.search')}
                          </Button>
                          <Button variant="ghost" onClick={() => navigate('/bookings')}>
                            {t('nav.bookings')}
                          </Button>
                          <Button variant="ghost" onClick={() => navigate('/pitch')}>
                            {t('nav.vision')}
                          </Button>
                          <Button variant="ghost" onClick={() => navigate('/contact')}>
                            {t('nav.contact')}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" className="w-full justify-start border-green-600 text-green-700" onClick={() => navigate('/login')}>
                            {t('nav.login') || "ACCEDI"}
                          </Button>
                          <Button className="gradient-primary text-white" onClick={() => navigate('/register')}>
                            {t('nav.register')}
                          </Button>
                          <Button variant="ghost" onClick={() => navigate('/pitch')}>
                            {t('nav.vision')}
                          </Button>
                          <Button variant="ghost" onClick={() => navigate('/contact')}>
                            {t('nav.contact')}
                          </Button>
                        </>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className={`flex-grow ${showNavigation && user ? 'pb-16 md:pb-0' : ''}`}>{children}</main>

      {showNavigation && (
        <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <div className="mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} {brandNameFull}. <span className="mx-2">|</span>
              <div className="flex items-center group cursor-pointer">
                <span className="mr-1">{t('footer.created_by')}</span>
                <Link to="/credits" className="flex items-center font-extrabold text-base bg-gradient-to-r from-indigo-600 to-lime-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity ml-1">
                  Massimiliano Sabato
                  <Dumbbell className="ml-2 w-5 h-5 text-indigo-500 animate-bounce" style={{ animationDuration: '2s' }} />
                </Link>
              </div>
            </div>
            <div className="flex space-x-6">
              <Link to="/pitch" className="hover:text-primary transition-colors text-sm">
                {t('nav.vision')}
              </Link>
              <Link to="/contact" className="hover:text-primary transition-colors text-sm">
                {t('nav.contact')}
              </Link>
              <a href="/business.html" className="hover:text-primary transition-colors font-medium">
                {t('nav.investors')} & Partners
              </a>
              <Link to="/privacy" className="hover:text-primary transition-colors text-sm">{t('nav.privacy')}</Link>
              <Link to="/terms" className="hover:text-primary transition-colors text-sm">{t('nav.terms')}</Link>
              <Link to="/investors" className="hover:text-primary transition-colors text-sm font-semibold text-indigo-600">{t('nav.investors')}</Link>
            </div>
          </div>
        </footer>
      )}

      {showNavigation && user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 z-50 py-2.5 px-6 flex justify-between items-center shadow-lg">
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex flex-col items-center gap-1 flex-1 text-slate-500 transition-colors ${
              location.pathname === '/dashboard' ? 'text-indigo-650 font-bold' : ''
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px]">Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/search')}
            className={`flex flex-col items-center gap-1 flex-1 text-slate-500 transition-colors ${
              location.pathname === '/search' ? 'text-indigo-650 font-bold' : ''
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-[10px]">Cerca</span>
          </button>
          <button
            onClick={() => navigate('/bookings')}
            className={`flex flex-col items-center gap-1 flex-1 text-slate-500 transition-colors ${
              location.pathname === '/bookings' ? 'text-indigo-650 font-bold' : ''
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-[10px]">Prenotazioni</span>
          </button>
          <button
            onClick={() => navigate('/wallet')}
            className={`flex flex-col items-center gap-1 flex-1 text-slate-500 transition-colors ${
              location.pathname === '/wallet' ? 'text-indigo-650 font-bold' : ''
            }`}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-[10px]">Wallet</span>
          </button>
          <button
            onClick={() => navigate(`/profile/${user.id}`)}
            className={`flex flex-col items-center gap-1 flex-1 text-slate-500 transition-colors ${
              location.pathname.startsWith('/profile') ? 'text-indigo-650 font-bold' : ''
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px]">Profilo</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
