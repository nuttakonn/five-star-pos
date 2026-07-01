import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data } = await api.post('/auth/login', { username, password });
      if (data.success) {
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('username', data.data.username);
        localStorage.setItem('user_role', data.data.role); // Store the role
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'การเข้าสู่ระบบล้มเหลว (Login failed)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-primary p-3 rounded-xl text-primary-foreground shadow-inner">
              <Store className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Five Star POS</CardTitle>
          <CardDescription>กรุณาเข้าสู่ระบบเพื่อใช้งานระบบ (Please login to continue)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Username</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="ชื่อผู้ใช้งาน"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all pr-10"
                  placeholder="รหัสผ่าน"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-red-600 text-xs bg-red-50 p-2 rounded-md text-center font-medium animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full py-6 text-lg font-bold" disabled={loading}>
              {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ (Login)'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
