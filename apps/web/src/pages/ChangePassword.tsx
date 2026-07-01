import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KeyRound } from "lucide-react";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่ไม่ตรงกัน (Passwords do not match)');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      setSuccess('เปลี่ยนรหัสผ่านสำเร็จแล้ว กำลังออกจากระบบ... (Password changed, logging out...)');
      
      // Clear storage and redirect after 2 seconds
      setTimeout(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_role');
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      setError(err.response?.data?.message || 'การเปลี่ยนรหัสผ่านล้มเหลว (Failed to change password)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account security credentials.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Current Password</label>
              <input 
                type="password" 
                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">New Password</label>
              <input 
                type="password" 
                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-medium">{error}</div>}
            {success && <div className="p-3 bg-green-50 text-green-600 text-xs rounded-lg text-center font-medium">{success}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
