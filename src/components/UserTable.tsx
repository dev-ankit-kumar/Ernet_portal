'use client';

import React from 'react';

interface User {
  id: number;
  USERNAME: string;
  STATE: string;
  PLAN: string;
  SERVICE_TYPE: string;
  ADDITIONAL_RESOURCES: string;
  TOTAL_AMOUNT: number;
  DISCOUNT: number;
  PI_DATE: string;
  INVOICE_DATE: string;
  ADDRESS: string;
  GSTIN_UIN: string;
  NUM_VMS: number;
}

interface Props {
  users: User[];
}

function formatDateToDDMMYYYY(dateString: string): string {
  const date = new Date(dateString);
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
            <th className="px-4 py-2">State</th>
            <th className="px-4 py-2">Service Type</th>
            <th className="px-4 py-2">Plan</th>
            <th className="px-4 py-2">Total (₹)</th>
            <th className="px-4 py-2">Discount (%)</th>
            <th className="px-4 py-2">PI Date</th>
            <th className="px-4 py-2">Invoice Date</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">GSTIN/UIN</th>
            <th className="px-4 py-2">No.of VMs</th>
            <th className="px-4 py-2">Additional Resources</th>
          </tr>
        </thead>
        <tbody>
          {[...users].reverse().map((user) => (
            <tr key={user.id} className="text-center even:bg-gray-100">
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.USERNAME}</td>
              <td className="px-4 py-2">{user.STATE}</td>
              <td className="px-4 py-2">{user.SERVICE_TYPE}</td>
              <td className="px-4 py-2">{user.PLAN}</td>
              <td className="px-4 py-2">{user.TOTAL_AMOUNT}</td>
              <td className="px-4 py-2">{user.DISCOUNT}</td>
              <td className="px-4 py-2">{formatDateToDDMMYYYY(user.PI_DATE)}</td>
              <td className="px-4 py-2">{formatDateToDDMMYYYY(user.INVOICE_DATE)}</td>
              <td className="px-4 py-2">{user.ADDRESS}</td>
              <td className="px-4 py-2">{user.GSTIN_UIN || '-'}</td>
              <td className="px-4 py-2">{user.NUM_VMS}</td>
              <td className="px-4 py-2">{user.ADDITIONAL_RESOURCES}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
