import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout = ({ children, showNavigation = true }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
              &copy; {new Date().getFullYear()} GymConnect AI. <Link to="/credits" className="hover:text-primary underline decoration-dotted">Credits</Link>
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
              <span className="cursor-pointer hover:text-slate-700">Privacy</span>
              <span className="cursor-pointer hover:text-slate-700">Terms</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
