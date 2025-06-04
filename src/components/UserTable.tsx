'use client';

import React from 'react';

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

interface Props {
  users: User[];
}

function formatDateToDDMMYYYY(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const UserTable: React.FC<Props> = ({ users }) => {
  if (users.length === 0) {
    return <p className="text-center text-gray-600">No users found.</p>;
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Phone No.</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">State</th>
            <th className="px-4 py-2">Service Type</th>
            <th className="px-4 py-2">Plan</th>
            <th className="px-4 py-2">Additional Resources</th>
            <th className="px-4 py-2">Total Amount (₹)</th>
            <th className="px-4 py-2">Discount (%)</th>
            <th className="px-4 py-2">PI Date</th>
            <th className="px-4 py-2">Invoice Date</th>
            <th className="px-4 py-2">Activation Date</th>
            <th className="px-4 py-2">Deactivation Date</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">gstin_uin</th>
            <th className="px-4 py-2">tan_no</th>
          </tr>
        </thead>
        <tbody>
          {[...users].reverse().map((user) => (
            <tr key={user.id} className="text-center even:bg-gray-100">
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.phone_no}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.state}</td>
              <td className="px-4 py-2">{user.serviceType}</td>
              <td className="px-4 py-2">{user.plan}</td>
              <td className="px-4 py-2">{user.additional_resources || '-'}</td>
              <td className="px-4 py-2">{user.total_amount}</td>
              <td className="px-4 py-2">{user.discount}</td>
              <td className="px-4 py-2">{formatDateToDDMMYYYY(user.pi_date)}</td>
              <td className="px-4 py-2">{formatDateToDDMMYYYY(user.invoice_date)}</td>
              <td className="px-4 py-2">{formatDateToDDMMYYYY(user.activation_date)}</td>
              <td className="px-4 py-2">{formatDateToDDMMYYYY(user.deactivation_date)}</td>
              <td className="px-4 py-2">{user.address}</td>
              <td className="px-4 py-2">{user.gstin_uin || '-'}</td>
              <td className="px-4 py-2">{user.tan_no || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
