
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import RoleSelector from '@/components/RoleSelector';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome, Mail, Lock, User, ArrowLeft } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'instructor' | 'gym' | ''>('');
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
      navigate('/register');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !selectedRole) {
      setShowRoleSelection(true);
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          navigate('/dashboard');
        }
      } else {
        const userType = selectedRole === 'instructor' ? 'trainer' : selectedRole === 'gym' ? 'gym_owner' : 'user';
        const userData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: userType
        };
        const { error } = await signUp(formData.email, formData.password, userData);
        if (!error) {
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

  const handleRoleSelect = (role: 'user' | 'instructor' | 'gym') => {
    setSelectedRole(role);
    setShowRoleSelection(false);
  };

  const handleBackToForm = () => {
    setShowRoleSelection(false);
    setSelectedRole('');
  };

  const handleToggleAuth = () => {
    setIsLogin(!isLogin);
    setShowRoleSelection(false);
    setSelectedRole('');
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 flex items-center justify-center py-12">
        <div className="max-w-4xl w-full mx-auto px-4">
          {!isLogin && showRoleSelection ? (
            <div className="text-center">
              <div className="mb-8">
                <Button
                  variant="ghost"
                  onClick={handleBackToForm}
                  className="mb-4 text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Torna al modulo
                </Button>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                  Scegli il tuo profilo
                </h1>
                <p className="text-xl text-slate-600 mb-2">
                  Prima di completare la registrazione, seleziona il tipo di account che desideri creare
                </p>
                <p className="text-lg text-green-600 font-medium mb-8">
                  Potrai modificare questa scelta in seguito nelle impostazioni del profilo
                </p>
              </div>
              <RoleSelector onRoleSelect={handleRoleSelect} selectedRole={selectedRole} />
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {isLogin ? 'Bentornato su GymConnect AI!' : 'Unisciti a GymConnect AI'}
                </h1>
                <p className="text-slate-600">
                  {isLogin 
                    ? 'Accedi al tuo account per continuare il tuo percorso fitness' 
                    : 'Crea il tuo account e trasforma la tua passione per il fitness'
                  }
                </p>
              </div>

              <div className="max-w-md mx-auto">
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

                    {/* Role Selection Indicator */}
                    {!isLogin && selectedRole && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 text-center flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <strong>Profilo selezionato:</strong> {
                            selectedRole === 'user' ? 'Atleta & Fitness Lover' : 
                            selectedRole === 'instructor' ? 'Personal Trainer & Coach' : 'Centro Fitness & Palestra'
                          }
                        </p>
                      </div>
                    )}

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
                        {!isLogin && (
                          <p className="text-xs text-slate-500 mt-1">
                            Minimo 6 caratteri
                          </p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full gradient-primary text-white text-lg py-3"
                        disabled={loading}
                      >
                        {loading ? 'Attendere...' : (
                          isLogin ? 'Accedi' : (
                            selectedRole ? 'Registrati' : 'Scegli il tuo Profilo →'
                          )
                        )}
                      </Button>
                    </form>

                    <div className="text-center">
                      <p className="text-slate-600">
                        {isLogin ? "Non hai un account?" : "Hai già un account?"}{' '}
                        <button 
                          onClick={handleToggleAuth}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          {isLogin ? 'Registrati qui' : 'Accedi qui'}
                        </button>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
