import React, { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUserStatus, useDeleteUser, useResetUserPassword } from '../hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Shield, Eye, CheckCircle2, XCircle, Trash2, Power, KeyRound } from "lucide-react";

export default function UserManagement() {
  const { data: users, isLoading } = useUsers();
  const createUserMutation = useCreateUser();
  const updateStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();
  const resetPasswordMutation = useResetUserPassword();
  
  const [isAdding, setIsAdding] = useState(false);
  const [resettingUser, setResettingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'viewer' });
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(formData, {
      onSuccess: () => {
        setIsAdding(false);
        setFormData({ username: '', password: '', role: 'viewer' });
      }
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    resetPasswordMutation.mutate({ 
      username: resettingUser.username, 
      newPassword 
    }, {
      onSuccess: () => {
        setResettingUser(null);
        setNewPassword('');
        alert(`Password for ${resettingUser.username} has been reset.`);
      }
    });
  };

  const toggleStatus = (username: string, currentStatus: string) => {
    updateStatusMutation.mutate({ username, active: currentStatus !== 'TRUE' });
  };

  const deleteUser = (username: string) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      deleteUserMutation.mutate(username);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          {isAdding ? 'Cancel' : 'Add New User'}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Create Staff Account</CardTitle>
            <CardDescription>Grant dashboard or admin access to your team.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Username</label>
                <input placeholder="Username" className="w-full border p-2 rounded-lg" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Password</label>
                <input placeholder="Password" type="password" className="w-full border p-2 rounded-lg" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Access Role</label>
                <select className="w-full border p-2 rounded-lg" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                  <option value="viewer">Viewer (View only)</option>
                  <option value="admin">Admin (Full Access)</option>
                </select>
              </div>
              <Button type="submit" disabled={createUserMutation.isPending} className="md:col-span-3">
                {createUserMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {resettingUser && (
        <Card className="border-orange-500 bg-orange-50/10">
          <CardHeader>
            <CardTitle className="text-orange-700 flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Reset Password: {resettingUser.username}
            </CardTitle>
            <CardDescription>Enter a new secure password for this user.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2 w-full">
                <label className="text-xs font-bold uppercase text-muted-foreground">New Password</label>
                <input 
                  type="password" 
                  placeholder="New Password" 
                  className="w-full border p-2 rounded-lg" 
                  required 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="default" className="bg-orange-600 hover:bg-orange-700" disabled={resetPasswordMutation.isPending}>
                  {resetPasswordMutation.isPending ? 'Resetting...' : 'Confirm Reset'}
                </Button>
                <Button variant="ghost" type="button" onClick={() => setResettingUser(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>Accounts authorized to access the POS system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user: any) => (
                  <tr key={user.username} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-bold">{user.username}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.role === 'admin' ? (
                          <Shield className="h-3.5 w-3.5 text-blue-600" />
                        ) : (
                          <Eye className="h-3.5 w-3.5 text-orange-600" />
                        )}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.active === 'TRUE' ? (
                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-orange-600 border-orange-200 hover:bg-orange-50" 
                          title="Reset Password"
                          onClick={() => setResettingUser(user)}
                        >
                            <KeyRound className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          title="Toggle Status"
                          onClick={() => toggleStatus(user.username, user.active)}
                          disabled={updateStatusMutation.isPending}
                        >
                            <Power className={`h-3.5 w-3.5 ${user.active === 'TRUE' ? 'text-red-600' : 'text-green-600'}`} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:bg-red-50" 
                          title="Delete User"
                          onClick={() => deleteUser(user.username)}
                          disabled={deleteUserMutation.isPending || user.username === localStorage.getItem('username')}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
