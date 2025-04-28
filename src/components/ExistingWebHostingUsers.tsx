'use client';

import React, { useEffect, useState } from 'react';

interface WebHostingUser {
  id: number;
  user_name: string;
  hosting_type: string;
  tariff_plan: string;
  yearly_amount: number;
  activation_date: string | null;
  email: string;
  contact_person: string;
}

const ExistingWebHostingUsers: React.FC = () => {
  const [users, setUsers] = useState<WebHostingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/webhosting-users')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched Data:', data);  // Debugging log

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.data)) {
          // In case backend wraps response like { data: [...] }
          setUsers(data.data);
        } else {
          console.error('Unexpected API response:', data);
          setUsers([]);  // Prevent map error
        }

        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    const dateObj = new Date(dateStr);
    return isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleDateString();
  };

  const formatAmount = (amount: number | null) => {
    if (amount == null || isNaN(amount)) return '₹0';
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Existing Web Hosting Users</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-red-500">No web hosting users found or failed to fetch data.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">User Name</th>
                <th className="px-4 py-2 border">Hosting Type</th>
                <th className="px-4 py-2 border">Tariff Plan</th>
                <th className="px-4 py-2 border">Yearly Amount</th>
                <th className="px-4 py-2 border">Activation Date</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Contact Person</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border">{user.user_name || 'N/A'}</td>
                  <td className="px-4 py-2 border text-center">{user.hosting_type || 'N/A'}</td>
                  <td className="px-4 py-2 border">{user.tariff_plan || 'N/A'}</td>
                  <td className="px-4 py-2 border text-right">{formatAmount(user.yearly_amount)}</td>
                  <td className="px-4 py-2 border text-center">{formatDate(user.activation_date)}</td>
                  <td className="px-4 py-2 border">{user.email || 'N/A'}</td>
                  <td className="px-4 py-2 border">{user.contact_person || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExistingWebHostingUsers;
