'use client';

import React, { useEffect, useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
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
  total_amount: number;
  discount: number;
  pi_date: string;
  invoice_date: string;
  address: string;
  gstin: string;
  tan: string;
  activation_date: string;
  deactivation_date: string;
  num_vms: number;
}

const ViewUserspage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      
      // Transform the data to match the complete User interface
      const transformedUsers = data.map((user: any) => ({
        id: user.id,
        username: user.USERNAME || user.username || null,
        phone_no: user.PHONE_NO || user.phone_no || null,
        email: user.EMAIL || user.email || null,
        state: user.STATE || user.state || null,
        serviceType: user.SERVICE_TYPE || user.serviceType || null,
        plan: user.PLAN || user.user_plan || null,
        additional_resources: user.ADDITIONAL_RESOURCES || user.additional_resources || null,
        total_amount: parseFloat(user.TOTAL_AMOUNT || user.total_amount) || 0,
        discount: parseFloat(user.DISCOUNT || user.discount) || 0,
        pi_date: user.PI_DATE || user.pi_date || null,
        invoice_date: user.INVOICE_DATE || user.invoice_date || null,
        address: user.ADDRESS || user.address || null,
        gstin: user.GSTIN || user.gstin || null,
        tan: user.TAN || user.tan_no || null,
        activation_date: user.ACTIVATION_DATE || user.activation_date || null,
        deactivation_date: user.DEACTIVATION_DATE || user.deactivation_date || null,
        num_vms: parseInt(user.NUM_VMS || user.num_vms) || null,
        
      }));
      
      setUsers(transformedUsers);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      console.log(userId);
      return;
      console
    }

    try {
      setDeleteLoading(userId);
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove the user from the local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      // Show success message (you can replace this with a toast notification)
      alert('User deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <SectionTitle title="All Registered Users" />

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading users...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No users found.</p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">ID</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Username</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Phone</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">activation_date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">deactivation_date</th>
                  {/* <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">State</th> */}
                  {/* <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Service Type</th> */}
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Plan</th>
                  {/* <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Resources</th> */}
                  {/* <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Amount</th> */}
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Discount</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">PI Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Invoice Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Address</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">GSTIN</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">TAN</th>
                  {/* <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">VMs</th> */}
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
               {[...users].reverse().map((user) => (

                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 text-sm text-gray-900 border-b">{user.id}</td>
                    <td className="px-3 py-2 text-sm font-medium text-gray-900 border-b">{user.username || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.phone_no || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.email || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.activation_date || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.deactivation_date || 'N/A'}</td>
                    {/* <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.state || 'N/A'}</td> */}
                    {/* <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.serviceType || 'N/A'}</td> */}
                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.plan || 'N/A'}</td>
                    {/* <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.additional_resources || 'N/A'}</td> */}
                    {/* <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.total_amount ? `₹${user.total_amount.toFixed(2)}` : 'N/A'}</td> */}
                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.discount > 0 ? `₹${user.discount.toFixed(2)}` : '0'}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{formatDate(user.pi_date)}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{formatDate(user.invoice_date)}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 border-b max-w-xs truncate" title={user.address || 'N/A'}>{user.address || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.gstin || 'N/A'}</td>
                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.tan || 'N/A'}</td>
                    {/* <td className="px-3 py-2 text-sm text-gray-600 border-b">{user.num_vms || 'N/A'}</td> */}
                    <td className="px-3 py-2 text-sm border-b">
                      {user.deactivation_date ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      ) : user.activation_date ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm border-b">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteLoading === user.id}
                          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                            deleteLoading === user.id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          {deleteLoading === user.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Total Users: {users.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(ViewUserspage);