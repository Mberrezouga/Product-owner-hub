import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OAUTH_MODE } from '../config/oauth.config';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);
  const { login, register, loginAsGuest, socialLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } else {
      const result = register(formData.name, formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/');
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(true);
    setError('');
    
    try {
      const result = await socialLogin(provider);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || `${provider} login failed`);
      }
    } catch (err) {
      setError(err.message || 'Social login failed');
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FolderKanban className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Product Owner Hub
          </CardTitle>
          <p className="text-sm text-slate-600 mt-2">
            {isLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium py-6"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => handleSocialLogin('google')}
              disabled={socialLoading}
              variant="outline" 
              className="w-full border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 py-6 relative"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
              {OAUTH_MODE === 'mock' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Demo</span>
              )}
            </Button>

            <Button 
              onClick={() => handleSocialLogin('microsoft')}
              disabled={socialLoading}
              variant="outline" 
              className="w-full border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50 py-6 relative"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Continue with Microsoft
              {OAUTH_MODE === 'mock' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Demo</span>
              )}
            </Button>

            <Button 
              onClick={handleGuestLogin}
              disabled={socialLoading}
              variant="outline" 
              className="w-full border-2 border-slate-200 hover:border-teal-300 hover:bg-teal-50 py-6"
            >
              <User className="h-4 w-4 mr-2" />
              Continue as Guest
            </Button>
          </div>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Copyright Footer */}
      <div className="text-center mt-6 text-sm text-slate-600">
        <p>© {new Date().getFullYear()} Product Owner Hub - All rights reserved</p>
        <p className="mt-1">Created by <span className="font-semibold text-teal-600">Malek Berrezouga</span></p>
      </div>
    </div>
  );
};

export default Auth;