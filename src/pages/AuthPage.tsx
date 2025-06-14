
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { Chrome, Mail, Lock, User } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          navigate('/dashboard');
        }
      } else {
        const userData = {
          first_name: formData.firstName,
          last_name: formData.lastName
        };
        const { error } = await signUp(formData.email, formData.password, userData);
        if (!error) {
          // Redirect to registration form to complete profile
          navigate('/register');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Bentornato!' : 'Unisciti a GymConnect AI'}
            </h1>
            <p className="text-slate-600">
              {isLogin 
                ? 'Accedi al tuo account per continuare' 
                : 'Crea il tuo account e inizia il tuo percorso fitness'
              }
            </p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-slate-900 flex items-center justify-center gap-2">
                <User className="w-6 h-6 text-green-600" />
                {isLogin ? 'Accedi' : 'Registrati'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Google Sign-in Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 text-lg flex items-center justify-center gap-3 hover:bg-slate-50"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Chrome className="w-5 h-5 text-blue-600" />
                {isLogin ? 'Accedi con Google' : 'Registrati con Google'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">oppure</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Cognome</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="mt-1"
                    minLength={6}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full gradient-primary text-white text-lg py-3"
                  disabled={loading}
                >
                  {loading ? 'Attendere...' : (isLogin ? 'Accedi' : 'Registrati')}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-slate-600">
                  {isLogin ? "Non hai un account?" : "Hai già un account?"}{' '}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    {isLogin ? 'Registrati qui' : 'Accedi qui'}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
