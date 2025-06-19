'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, User, Users, FileText, Calendar, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import Navbar from './Navbar';

interface FormData {
  username: string;
  user_plan: string;
  email_hosting_amount: number;
  web_hosting_amount: number;
  activation_date: string | null;
  deactivation_date: string | null;
  plan_for_year: number;
  gstin: string;
  address: string;
  phone_no: string;
  email: string;
  tan_no: string;
}

const defaultData: FormData = {
  username: '',
  user_plan: '',
  email_hosting_amount: 0,
  web_hosting_amount: 0,
  activation_date: '',
  deactivation_date: '',
  plan_for_year: 0,
  gstin: '',
  address: '',
  phone_no: '',
  email: '',
  tan_no: '',
};

const UserEntry: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [excelData, setExcelData] = useState<FormData[]>([]);
  const [message, setMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle numbers
    const numberFields = ['email_hosting_amount', 'web_hosting_amount', 'plan_for_year'];
    const parsedValue = numberFields.includes(name)
      ? parseFloat(value) || 0
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      setMessage(result.message || 'User added successfully');
    } catch (err) {
      setMessage('Error submitting user');
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      // Manual parser for dd.mm.yyyy
      const parseDDMMYYYY = (value: string): string => {
        if (!value || typeof value !== 'string') return '';
        const [dd, mm, yyyy] = value.split('.');
        if (!dd || !mm || !yyyy) return '';
        const iso = new Date(`${yyyy}-${mm}-${dd}`);
        return isNaN(iso.getTime()) ? '' : iso.toISOString().split('T')[0];
      };

      const mappedData: FormData[] = (rawData as any[])
        .map((row) => ({
          username: row['User Name']?.toString().trim() || '',
          user_plan: row['User Plan']?.toString().trim() || '',
          email_hosting_amount: parseFloat(row['E-mail Hosting']) || 0,
          web_hosting_amount: parseFloat(row['Web-Hosting']) || 0,
          activation_date: parseDDMMYYYY(row['Activation Date']),
          deactivation_date: parseDDMMYYYY(row['Deactivation Date']),
          plan_for_year: parseInt(row['Plan for year']) || 0,
          gstin: row['GST No.']?.toString().trim() || '',
          address: row['Address']?.toString().trim() || '',
          phone_no: row['Phone No.']?.toString().trim() || '',
          email: row['Email-ID']?.toString().trim() || '',
          tan_no: row['TAN No.']?.toString().trim() || '',
        }))
        .filter((row) => row.username); // filter out empty usernames

      setExcelData(mappedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleBulkSubmit = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bulk-add-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: excelData }),
      });

      const result = await res.json();
      setMessage(result.message || 'Bulk upload complete');
    } catch {
      setMessage('Bulk upload failed');
    }
  };

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'username': return <User className="w-4 h-4 text-gray-500" />;
      case 'email': return <Mail className="w-4 h-4 text-gray-500" />;
      case 'phone_no': return <Phone className="w-4 h-4 text-gray-500" />;
      case 'address': return <MapPin className="w-4 h-4 text-gray-500" />;
      case 'activation_date':
      case 'deactivation_date': return <Calendar className="w-4 h-4 text-gray-500" />;
      case 'gstin':
      case 'tan_no': return <FileText className="w-4 h-4 text-gray-500" />;
      case 'email_hosting_amount':
      case 'web_hosting_amount': return <CreditCard className="w-4 h-4 text-gray-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatLabel = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">User Management System</h1>
          <p className="text-gray-600">Add users manually or upload in bulk via Excel</p>
        </div>

        {/* Manual Entry Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-xl mr-4">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Manual Entry</h2>
              <p className="text-gray-600">Add a single user with detailed information</p>
            </div>
          </div>

          <div onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formatLabel(key)}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {getFieldIcon(key)}
                    </div>
                    {key === 'address' ? (
                      <textarea
                        name={key}
                        value={value ?? ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder={`Enter ${formatLabel(key).toLowerCase()}`}
                      />
                    ) : (
                      <input
                        type={key.includes('date') ? 'date' : key.includes('amount') || key === 'plan_for_year' ? 'number' : 'text'}
                        name={key}
                        value={value ?? ''}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={key.includes('date') ? '' : `Enter ${formatLabel(key).toLowerCase()}`}
                        step={key.includes('amount') ? '0.01' : undefined}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center pt-4">
              <button 
                onClick={handleFormSubmit}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Submit User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-xl mr-4">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Bulk Upload</h2>
              <p className="text-gray-600">Upload multiple users via Excel file (.xlsx, .xls)</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-200">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <label className="cursor-pointer">
                <span className="text-lg font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200">
                  Choose Excel File
                </span>
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  onChange={handleExcelUpload}
                  className="hidden"
                />
              </label>
              <p className="text-gray-500 mt-2">Supports .xlsx and .xls formats</p>
            </div>

            {excelData.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">
                        {excelData.length} users ready for upload
                      </p>
                      <p className="text-green-600 text-sm">File processed successfully</p>
                    </div>
                  </div>
                  <button
                    onClick={handleBulkSubmit}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <Users className="w-5 h-5" />
                    <span>Upload {excelData.length} Users</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className={`p-4 rounded-xl border-l-4 shadow-md ${
              message.includes('Error') || message.includes('failed')
                ? 'bg-red-50 border-red-400 text-red-700'
                : 'bg-blue-50 border-blue-400 text-blue-700'
            }`}>
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${
                  message.includes('Error') || message.includes('failed')
                    ? 'bg-red-100'
                    : 'bg-blue-100'
                }`}>
                  {message.includes('Error') || message.includes('failed') ? (
                    <FileText className="w-5 h-5 text-red-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <p className="font-medium">{message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default UserEntry;