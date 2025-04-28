'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';


const AddVmDetailsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    hostname: '',
    core: '',
    ram: '',
    storage: '',
    tariffPlan: '',
    os: '',
    privateIp: '',
    publicIp: '',
    password: '',
    websiteName: '',
    contactNo: '',
  });
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);
  
      try {
        const res = await fetch('http://localhost:5000/api/bulk-add-vms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vms: jsonData }),
        });
  
        const response = await res.json();
        if (!res.ok) throw new Error(response.message);
  
        alert(`✅ ${response.inserted} VM(s) inserted successfully.`);
      } catch (err: any) {
        alert(`❌ Failed: ${err.message}`);
      }
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({
    text: '',
    type: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('http://localhost:5000/api/add-vm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit');

      setMessage({ text: 'VM details added successfully!', type: 'success' });
      setFormData({
        hostname: '',
        core: '',
        ram: '',
        storage: '',
        tariffPlan: '',
        os: '',
        privateIp: '',
        publicIp: '',
        password: '',
        websiteName: '',
        contactNo: '',
      });
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : 'An unexpected error occurred',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const labelStyle = 'block text-sm font-medium text-gray-700 mb-1';
  const inputStyle =
    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400';

  return (
    <>
    

      <div className="bg-white p-6 md:p-8 shadow-md rounded-lg max-w-5xl mx-auto mt-10">
        


      <div className="mt-8 border-t border-gray-200 pt-6">
  <h3 className="text-lg font-semibold mb-4 text-gray-800">Import VMs from Excel</h3>
  
  <div className="flex items-center">
    <label className="relative cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 inline-flex items-center">
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
      </svg>
      Upload Excel
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </label>
    <span className="ml-3 text-sm text-gray-500">
      .xlsx or .xls files only
    </span>
  </div>
</div>



        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Add VM Details</h2>

        {message.text && (
          <div
            className={`p-3 mb-6 text-sm rounded-md ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Hostname</label>
              <input name="hostname" value={formData.hostname} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
              <label className={labelStyle}>Core</label>
              <input name="core" value={formData.core} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
              <label className={labelStyle}>RAM</label>
              <input name="ram" value={formData.ram} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
              <label className={labelStyle}>Storage</label>
              <input name="storage" value={formData.storage} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
              <label className={labelStyle}>Tariff Plan</label>
              <input name="tariffPlan" value={formData.tariffPlan} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Operating System</label>
              <input name="os" value={formData.os} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Private IP</label>
              <input name="privateIp" value={formData.privateIp} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Public IP</label>
              <input name="publicIp" value={formData.publicIp} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>VM Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Website Name</label>
              <input name="websiteName" value={formData.websiteName} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Contact Number</label>
              <input name="contactNo" value={formData.contactNo} onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md focus:outline-none transition"
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddVmDetailsPage;
