'use client';

import React, { useEffect, useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import UserTable from '@/components/UserTable';
import withAuth from '@/components/withAuth';
import Navbar from '@/components/Navbar';

interface User {
  id: number;
  USERNAME: string;
  STATE: string;
  PLAN: string;
  ADDITIONAL_RESOURCES: string;
  TOTAL_AMOUNT: number;
  DISCOUNT: number;
  PI_DATE: string;
  INVOICE_DATE: string;
}

const ViewUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users'); // ✅ corrected route
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);




  const handleUpdateUser = async (userId: number, updatedUser: Partial<User>) => {
  try {
    const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update user');
    alert('User updated successfully!');
    setUsers(users.map(user => (user.id === userId ? { ...user, ...updatedUser } : user)));
  } catch (error: unknown) {
    alert(error instanceof Error ? error.message : 'Unknown error');
  }
};

const handleDeleteUser = async (userId: number) => {
  try {
    const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete user');
    alert('User deleted successfully!');
    setUsers(users.filter(user => user.id !== userId));
  } catch (error: unknown) {
    alert(error instanceof Error ? error.message : 'Unknown error');
  }
};


  return (
    <>
      <Navbar />
      <div className="p-4 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <SectionTitle title="All Registered Users" />

          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}
          {!loading && !error && (
            <UserTable users={users} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} />

          )}
        </div>
      </div>
    </>
  );
};

export default withAuth(ViewUsersPage);
