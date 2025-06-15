
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Per favore inserisci email e password');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signIn(formData.email, formData.password);
      if (!error) {
        navigate('/dashboard');
      } else {
        setError('Credenziali non valide. Controlla email e password.');
      }
    } catch (err) {
      setError('Si è verificato un errore durante l\'accesso. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mx-auto flex items-center justify-center">
                <span className="text-white font-bold text-2xl">GC</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Bentornato!
            </h1>
            <p className="text-slate-600">
              Accedi al tuo account GymConnect AI
            </p>
          </div>

          {/* Login Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-center text-slate-900">Accedi</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="inserisci la tua email"
                    required
                    disabled={loading}
                    className="h-12 border-slate-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="inserisci la tua password"
                      required
                      disabled={loading}
                      className="h-12 border-slate-200 focus:border-green-500 focus:ring-green-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Accesso in corso...
                    </>
                  ) : (
                    'Accedi'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">oppure</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-slate-600">
                  Non hai ancora un account?{' '}
                  <button 
                    onClick={() => navigate('/auth')}
                    className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
                    disabled={loading}
                  >
                    Registrati qui
                  </button>
                </p>
              </div>

              {/* Back to Home */}
              <div className="text-center pt-4 border-t border-slate-100">
                <button 
                  onClick={() => navigate('/')}
                  className="text-slate-500 hover:text-slate-700 text-sm transition-colors"
                  disabled={loading}
                >
                  ← Torna alla homepage
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-slate-500">
            <p>© 2024 GymConnect AI. Tutti i diritti riservati.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
