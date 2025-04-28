'use client';

import React, { useEffect, useState } from 'react';

interface VmDetails {
  id: number;
  hostname: string;
  core: string;
  ram: string;
  storage: string;
  tariff_plan: string;
  os: string;
  private_ip: string;
  public_ip: string;
  password: string;
  website_name: string;
  contact_no: string;
  created_at: string;
}

const ViewVmsPage: React.FC = () => {
  const [vms, setVms] = useState<VmDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/vms')
      .then(res => res.json())
      .then(data => {
        setVms(data.vms || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching VMs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Existing VM Details</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="overflow-auto rounded shadow">
            <table className="min-w-full bg-white text-sm border">
              <thead className="bg-gray-100 border-b text-xs">
                <tr>
                  <th className="px-3 py-2 text-left">Hostname</th>
                  <th className="px-3 py-2 text-left">Core</th>
                  <th className="px-3 py-2 text-left">RAM</th>
                  <th className="px-3 py-2 text-left">Storage</th>
                  <th className="px-3 py-2 text-left">Tariff Plan</th>
                  <th className="px-3 py-2 text-left">OS</th>
                  <th className="px-3 py-2 text-left">Private IP</th>
                  <th className="px-3 py-2 text-left">Public IP</th>
                  <th className="px-3 py-2 text-left">Password</th>
                  <th className="px-3 py-2 text-left">Website</th>
                  <th className="px-3 py-2 text-left">Contact</th>
                </tr>
              </thead>
              <tbody>
                {vms.map(vm => (
                  <tr key={vm.id} className="even:bg-gray-50 border-b">
                    <td className="px-3 py-2">{vm.hostname}</td>
                    <td className="px-3 py-2">{vm.core}</td>
                    <td className="px-3 py-2">{vm.ram}</td>
                    <td className="px-3 py-2">{vm.storage}</td>
                    <td className="px-3 py-2">{vm.tariff_plan}</td>
                    <td className="px-3 py-2">{vm.os}</td>
                    <td className="px-3 py-2">{vm.private_ip}</td>
                    <td className="px-3 py-2">{vm.public_ip}</td>
                    <td className="px-3 py-2">{vm.password}</td>
                    <td className="px-3 py-2">{vm.website_name}</td>
                    <td className="px-3 py-2">{vm.contact_no}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewVmsPage;
