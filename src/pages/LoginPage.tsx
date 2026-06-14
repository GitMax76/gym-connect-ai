
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/contexts/BrandingContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const { t } = useLanguage();
  const { brandNameFull, brandInitials } = useBranding();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError(t('login.enter_credentials'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(formData.email, formData.password);
      if (!error) {
        navigate('/dashboard');
      } else {
        setError(t('login.invalid_credentials'));
      }
    } catch (err) {
      setError(t('login.error_generic'));
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full mx-auto flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white font-bold text-2xl tracking-wider">{brandInitials}</span>
              </div>
            </div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent mb-1">
              {brandNameFull}
            </h2>
            <h1 className="text-xl font-bold text-slate-800 mb-1">
              {t('login.welcome_back')}
            </h1>
            <p className="text-slate-500 text-sm">
              {t('login.subtitle').replace('{brandName}', brandNameFull)}
            </p>
          </div>

          {/* Login Form */}
          <Card className="shadow-xl border-slate-200/80 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-center font-bold text-slate-800">{t('login.title')}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                  <AlertDescription className="font-semibold text-xs">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={t('login.email_placeholder')}
                    required
                    disabled={loading}
                    className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder={t('login.password_placeholder')}
                      required
                      disabled={loading}
                      className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-650"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg transition-all active:scale-95 shadow-md shadow-indigo-100 border-0"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('login.loading')}
                    </>
                  ) : (
                    t('login.title')
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold">{t('login.or')}</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center space-y-3">
                <p className="text-slate-500 text-sm">
                  {t('login.no_account')}
                  <button
                    onClick={() => navigate('/register')}
                    className="text-indigo-600 hover:text-indigo-75px font-bold hover:underline transition-colors"
                    disabled={loading}
                  >
                    {t('login.register_here')}
                  </button>
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-slate-500 text-sm">
                    {t('login.manage_gym')}
                    <button
                      onClick={() => navigate('/register?role=gym')}
                      className="text-indigo-650 hover:text-indigo-800 font-bold hover:underline transition-colors"
                      disabled={loading}
                    >
                      {t('login.register_gym')}
                    </button>
                  </p>
                </div>
              </div>

              {/* Back to Home */}
              <div className="text-center pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate('/')}
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold transition-colors"
                  disabled={loading}
                >
                  {t('login.back_home')}
                </button>
              </div>

              {/* Demo Accounts Quick-Select */}
              <div className="pt-4 border-t border-slate-150 bg-slate-50/60 p-3.5 rounded-xl mt-4 border border-dashed border-slate-200">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider text-center mb-2.5">
                  ⚡ ACCESSO RAPIDO DEMO (TESTER)
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="w-full text-xs font-bold py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-lime-50 hover:text-lime-700 transition-all text-left flex items-center gap-2"
                    onClick={() => {
                      setFormData({ email: 'rome_user_1@test.com', password: 'password123' });
                    }}
                  >
                    🏃‍♂️ <span className="flex-1">Accedi come Atleta (Roma)</span>
                  </button>
                  <button
                    type="button"
                    className="w-full text-xs font-bold py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:text-indigo-750 transition-all text-left flex items-center gap-2"
                    onClick={() => {
                      setFormData({ email: 'marco.bianchi@test.com', password: 'password123' });
                    }}
                  >
                    💪 <span className="flex-1">Accedi come Trainer (Roma)</span>
                  </button>
                  <button
                    type="button"
                    className="w-full text-xs font-bold py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-violet-50 hover:text-violet-750 transition-all text-left flex items-center gap-2"
                    onClick={() => {
                      setFormData({ email: 'info@powergymroma.com', password: 'password123' });
                    }}
                  >
                    🏢 <span className="flex-1">Accedi come Palestra (Roma)</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-slate-400 font-medium">
            <p>{t('login.footer').replace('{brandName}', brandNameFull)}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
