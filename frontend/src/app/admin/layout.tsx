'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { AdminSidebar } from '@/components/Admin/Layout/AdminSidebar';
import { AdminHeader } from '@/components/Admin/Layout/AdminHeader';
import { Loader2 } from 'lucide-react';
import { fetchCurrentUser } from '@/services/client/authService';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let currentUser = user;
        if (!currentUser) {
          currentUser = await fetchCurrentUser();
          setUser(currentUser);
        }

        if (!currentUser) {
          router.push('/login');
        } else if (currentUser.role !== 'ADMIN' && currentUser.role !== 'STAFF') {
          router.push('/'); // Redirect unauthorized users to home
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Auth check failed', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user, setUser, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
