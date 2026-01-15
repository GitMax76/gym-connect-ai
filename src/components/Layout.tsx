import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Dumbbell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout = ({ children, showNavigation = true }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 animate-gradient-x">
      {showNavigation && (
        <nav className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div
                className="flex items-center cursor-pointer group"
                onClick={() => navigate('/')}
              >
                <div className="w-8 h-8 gradient-primary rounded-lg mr-3 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GC</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                  GymConnect AI
                </span>
              </div>

              {/* Desktop Navigation */}
              {user && (
                <div className="hidden md:flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className={location.pathname === '/dashboard' ? 'bg-slate-100' : ''}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/search')}
                    className={location.pathname === '/search' ? 'bg-slate-100' : ''}
                  >
                    Cerca
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/bookings')}
                    className={location.pathname === '/bookings' ? 'bg-slate-100' : ''}
                  >
                    Prenotazioni
                  </Button>
                </div>
              )}

              <div className="hidden md:flex items-center space-x-4">
                {location.pathname === '/' ? (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/login')}>
                      Accedi
                    </Button>
                    <Button onClick={() => navigate('/register')} className="gradient-primary text-white">
                      Registrati
                    </Button>
                    <Link
                      to="/contact"
                      className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Contatti
                    </Link>
                    <Link
                      to="/pitch"
                      className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Vision
                    </Link>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => navigate('/')}>
                      Home
                    </Button>
                    <Link
                      to="/pitch"
                      className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Vision
                    </Link>
                    <Link
                      to="/contact"
                      className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Contatti
                    </Link>
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
                            Dashboard
                          </Button>
                          <Button variant="ghost" onClick={() => navigate('/search')}>
                            Cerca
                          </Button>
                          <Button variant="ghost" onClick={() => navigate('/bookings')}>
                            Prenotazioni
                          </Button>
                          <Button variant="ghost" onClick={() => navigate('/pitch')}>
                            Vision
                          </Button>
                          <Button variant="ghost" onClick={() => navigate('/contact')}>
                            Contatti
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" onClick={() => navigate('/login')}>
                            Accedi
                          </Button>
                          <Button className="gradient-primary text-white" onClick={() => navigate('/register')}>
                            Registrati
                          </Button>
                          <Button variant="ghost" onClick={() => navigate('/pitch')}>
                            Vision
                          </Button>
                          <Button variant="ghost" onClick={() => navigate('/contact')}>
                            Contatti
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
      <main className="flex-grow">{children}</main>

      {showNavigation && (
        <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <div className="mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} GymConnect AI. <span className="mx-2">|</span>
              <div className="flex items-center group cursor-pointer">
                <span className="mr-1">Created by</span>
                <Link to="/credits" className="flex items-center font-extrabold text-base bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity ml-1">
                  Massimiliano Sabato
                  <Dumbbell className="ml-2 w-5 h-5 text-blue-500 animate-bounce" style={{ animationDuration: '2s' }} />
                </Link>
              </div>
            </div>
            <div className="flex space-x-6">
              <Link to="/pitch" className="hover:text-primary transition-colors text-sm">
                Vision
              </Link>
              <Link to="/contact" className="hover:text-primary transition-colors text-sm">
                Contatti
              </Link>
              <a href="/business.html" className="hover:text-primary transition-colors font-medium">
                Investors & Partners
              </a>
              <Link to="/privacy" className="hover:text-primary transition-colors text-sm">Privacy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors text-sm">Terms</Link>
              <Link to="/investors" className="hover:text-primary transition-colors text-sm font-semibold text-green-600">Investors</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
