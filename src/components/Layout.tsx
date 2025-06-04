
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout = ({ children, showNavigation = true }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

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
              
              <div className="flex items-center space-x-4">
                {location.pathname === '/' ? (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/login')}>
                      Accedi
                    </Button>
                    <Button onClick={() => navigate('/register')} className="gradient-primary text-white">
                      Registrati
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => navigate('/')}>
                    Home
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
