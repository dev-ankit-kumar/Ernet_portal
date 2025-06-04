'use client';

import React, { useEffect, useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import UserTable from '@/components/UserTable';
import withAuth from '@/components/withAuth';

interface User {
  id: number;
  username: string;
  phone_no: string;
  email: string;
  state: string;
  serviceType: string;
  plan: string;
  additional_resources: string;
  total_amount: string;
  discount: string;
  pi_date: string;
  invoice_date: string;
  address: string;
  gstin_uin: string;
  tan_no: string;
  activation_date: string;
  deactivation_date: string;
}


const ViewUserspage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        
        // Transform the data to match the expected User interface
        const transformedUsers = data.map((user: any) => ({
          id: user.id,
          username: user.USERNAME || user.username,
          phone_no: user.PHONE_NO || user.phone_no || '',
          email: user.EMAIL || user.email || '',
          state: user.STATE || user.state,
          gstin: user.GSTIN || user.gstin,
          address: user.ADDRESS || user.address || '',
          plan: user.PLAN || user.plan,
          service_type: user.SERVICE_TYPE || user.service_type,
          additional_resources: user.ADDITIONAL_RESOURCES || user.additional_resources,
          total_amount: user.TOTAL_AMOUNT || user.total_amount,
          discount: user.DISCOUNT || user.discount,
          pi_date: user.PI_DATE || user.pi_date,
          invoice_date: user.INVOICE_DATE || user.invoice_date,
          reference_no: user.REFERENCE_NO || user.reference_no,
          num_vms: user.NUM_VMS || user.num_vms,
          amount_in_words: user.AMOUNT_IN_WORDS || user.amount_in_words,
          activation_date: user.ACTIVATION_DATE || user.activation_date,
          deactivation_date: user.DEACTIVATION_DATE || user.deactivation_date,
          tan_no: user.TAN_NO || user.tan_no,
          gstin_uin: user.GSTIN_UIN || user.gstin_uin,
          serviceType: user.SERVICE_TYPE || user.serviceType,

        }));
        
        setUsers(transformedUsers);
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

export default withAuth(ViewUserspage);