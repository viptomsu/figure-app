'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserTable } from '@/components/Admin/User/UserTable';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { getAllUsers } from '@/services/client/userService';
import { User } from '@/services/types';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers(1, 100, searchTerm);
      const data = response.content || response.data || [];
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage registered users.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <UserTable users={users} isLoading={isLoading} />
    </div>
  );
}
