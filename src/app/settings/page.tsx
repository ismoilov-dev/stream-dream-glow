'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/lib/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: user, isLoading, refetch } = useCurrentUser();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.patch('/api/users/me/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/users/change-password/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to change password');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfileMutation.mutate(formData);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">First Name</label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Last Name</label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, last_name: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  passwordData.new_password !== passwordData.confirm_password
                ) {
                  toast.error('Passwords do not match');
                  return;
                }
                changePasswordMutation.mutate({
                  old_password: passwordData.old_password,
                  new_password: passwordData.new_password,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium block mb-2">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      old_password: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      new_password: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirm_password: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending
                  ? 'Changing...'
                  : 'Change Password'}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}