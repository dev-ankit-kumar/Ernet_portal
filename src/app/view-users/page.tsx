'use client';

import React, { useEffect, useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import UserTable from '@/components/UserTable';
import withAuth from '@/components/withAuth';

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
        const res = await fetch('http://localhost:5000/api/users');
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

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <SectionTitle title="All Registered Users" />

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
        {!loading && !error && <UserTable users={users} />}
      </div>
    </div>
  );
};

export default withAuth(ViewUsersPage);
