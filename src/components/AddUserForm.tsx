'use client';

import React, { useState } from 'react';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  username:string,
  phone_no: string,
  email: string,
  address: string,
  serviceType: string,
  user_plan: string,
  plan_for_year:string,
  email_hosting_amount:string,
  web_hosting_amount:string,
  activation_date:string,
  deactivation_date:string,
  gstin:string,
  tan_no:string,
}

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const servicePlanOptions: Record<string, string[]> = {
    'Dedicated Web Hosting': [
        'S-11 – 1 vCPU, 1 GB RAM, 70 GB Storage',
        'S-14 – 1 vCPU, 4 GB RAM, 70 GB Storage',
        'S-22 – 2 vCPU, 8 GB RAM, 70 GB Storage',
        'S-28 – 2 vCPU, 8 GB RAM, 70 GB Storage',
        'P-11 (WH-1) – 4 vCPU, 4 GB RAM, 100 GB Storage',
        'P-14 – 4 vCPU, 16 GB RAM, 200 GB Storage',
        'P-22 (WH-2) – 8 vCPU, 8 GB RAM, 100 GB Storage',
        'P-28 – 8 vCPU, 32 GB RAM, 200 GB Storage',
        'P-44 (WH-3) – 16 vCPU, 16 GB RAM, 250 GB Storage',
        'P-48 – 16 vCPU, 32 GB RAM, 1000 GB Storage',
        'P-88 (WH-5) – 32 vCPU, 32 GB RAM, 500 GB Storage',
        'P-816 – 32 vCPU, 64 GB RAM, 1500 GB Storage'
      ],
  'Shared Web Hosting': ['SH-1 with Storage: 5GB, Data access: Unlimited, Application supported: Php / ASP.Net, Data base: MS SQL & Mariadb etc, Access: Through user application /SFTP',
    'SH-2 with Storage: 10GB, Data access: Unlimited, Application supported: Php / ASP.Net, Data base: MS SQL & Mariadb etc, Access: Through user application /SFTP '
  ],
};

const SubscriptionForm: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    username: '',
    phone_no: '',
    email: '',
    user_plan: '',
    serviceType: '',
    address: '',
    gstin: '',
    activation_date: '',
    deactivation_date: '',
    tan_no:'',
    plan_for_year: '',
    email_hosting_amount: '',
    web_hosting_amount: '',
  });

  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({
    text: '',
    type: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'serviceType' ? { plan: '' } : {}), // reset plan if serviceType changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
  
    try {
      // 1) send to DB
      const res = await fetch('http://localhost:5000/api/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit');
      }
  
      // 2) show a quick success message (optional)
      setMessage({ text: 'User added successfully!', type: 'success' });
  
      // 3) redirect to your new invoice page
      router.push(`/invoice/${data.id}`);
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : 'An unexpected error occurred',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpload = () => {
    fileInputRef.current?.click();
  };

  // Helper function to find value by multiple possible column names
  const findValue = (row: any, possibleNames: string[], defaultValue: string = ''): string => {
    for (const name of possibleNames) {
      if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
        return String(row[name]).trim();
      }
    }
    return defaultValue;
  };

  const processExcelFile = async (file: File) => {
    try {
      setIsBulkUploading(true);
      setMessage({ text: '', type: '' });

      // Read the file
      const arrayBuffer = await file.arrayBuffer();
      
      // Import XLSX dynamically to avoid SSR issues
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
      if (jsonData.length === 0) {
        throw new Error('Excel file is empty or has no valid data');
      }

      // Debug: Log the first row to see actual column names
     const transformedData = jsonData.map((row: any, index: number) => {
  const userData = {
    username: findValue(row, ['User Name', 'Username', 'Name']) || null,
    user_plan: findValue(row, ['User Plan', 'Plan']) || null,
    email_hosting_amount: parseFloat(findValue(row, ['E-mail Hosting', 'Email Hosting'], '0')) || 0,
    web_hosting_amount: parseFloat(findValue(row, ['Web-Hosting', 'Web Hosting'], '0')) || 0,
    activation_date: formatDate(findValue(row, ['Activation Date'])) || null,
    deactivation_date: formatDate(findValue(row, ['Deactivation Date'])) || null,
    plan_for_year: parseInt(findValue(row, ['Plan for year'], '1')) || null,
    gstin: findValue(row, ['GST No.', 'GST No', 'gstin', 'GST']) || null,
    address: findValue(row, ['Address']) || null,
    phone_no: findValue(row, ['Phone No.', 'Phone', 'Contact']) || null,
    email: findValue(row, ['Email-ID', 'Email']) || null,
    tan_no: findValue(row, ['TAN No.', 'TAN']) || null,
  };

  console.log(`Row ${index + 1}`, userData);
  return userData;
});

console.log(`Processed ${transformedData.length} rows from Excel`);


      // Send bulk data to your API
      const response = await fetch('http://localhost:5000/api/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: transformedData }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload users');
      }

      // setMessage({ 
      //   text: `Successfully uploaded ${validData.length} users!${validData.length < transformedData.length ? ` (${transformedData.length - validData.length} rows skipped due to missing data)` : ''}`, 
      //   type: 'success' 
      // });

      // Optional: Refresh the page or redirect
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Bulk upload error:', error);
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to process Excel file',
        type: 'error',
      });
    } finally {
      setIsBulkUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        processExcelFile(file);
      } else {
        setMessage({
          text: 'Please select a valid Excel file (.xlsx or .xls)',
          type: 'error',
        });
      }
    }
  };

  // Helper functions
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return '';
    
    // If it's already a valid date string, return it
    if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateValue;
    }
    
    // Handle Excel date serial numbers
    if (typeof dateValue === 'number') {
      const date = new Date((dateValue - 25569) * 86400 * 1000);
      return date.toISOString().split('T')[0];
    }
    
    // Try to parse other date formats
    try {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.warn('Could not parse date:', dateValue);
    }
    
    return '';
  };

  const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  const getFutureDate = (months: number = 12): string => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  const labelStyle = 'block text-sm font-medium text-gray-700 mb-1';
  const inputStyle =
    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400';

  return (
    <div className="bg-white p-6 md:p-8 shadow-md rounded-lg max-w-6xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
        
        {/* Bulk Upload Button */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleBulkUpload}
            disabled={isBulkUploading}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md focus:outline-none transition disabled:bg-green-400"
          >
            {isBulkUploading ? 'Uploading...' : 'Bulk Upload Excel'}
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Instructions for bulk upload */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">Bulk Upload Instructions:</h3>
        <div className="text-sm text-blue-700 mb-2">
          <p className="mb-2">Your Excel file should contain these required columns (exact names):</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <strong>Required:</strong>
              <ul className="list-disc list-inside ml-2">
                <li>User Name (or Username, Name)</li>
                <li>Phone No. (or Phone, Mobile)</li>
                <li>Email (or E-mail, Email-ID)</li>
                <li>Total Amount (or Amount, Price)</li>
              </ul>
            </div>
            <div>
              <strong>Optional:</strong>
              <ul className="list-disc list-inside ml-2">
                <li>State</li>
                <li>Service Type (or Hosting)</li>
                <li>User Plan (or Plan)</li>
                <li>GST No. (or GST)</li>
                <li>Address</li>
                <li>PI Date, Invoice Date</li>
                <li>Activation Date, Deactivation Date</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-xs text-blue-600">
          Note: Dates should be in YYYY-MM-DD format or Excel date format. Missing optional fields will use default values.
          Check browser console for detailed column mapping information.
        </p>
      </div>

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
  {/* Section 1: Basic User Information */}
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className={labelStyle}>User Name</label>
        <input 
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          required 
          className={inputStyle} 
        />
      </div>
      <div>
        <label className={labelStyle}>Phone No.</label>
        <input 
          name="phone_no" 
          type="tel" 
          value={formData.phone_no} 
          onChange={handleChange} 
          required 
          className={inputStyle} 
        />
      </div>
      <div>
        <label className={labelStyle}>Email-ID</label>
        <input 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          className={inputStyle} 
        />
      </div>
      <div>
        <label className={labelStyle}>Address</label>
        <textarea 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          rows={2} 
          required 
          className={inputStyle} 
        />
      </div>
    </div>
  </div>

  {/* Section 2: Service Configuration */}
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Configuration</h3>
    <div className="grid grid-cols-1 gap-6">
      <div>
        <label className={labelStyle}>Service Type</label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          required
          className={inputStyle}
        >
          <option value="">Select Service Type</option>
          <option value="Dedicated Web Hosting">Dedicated Web Hosting</option>
          <option value="Shared Web Hosting">Shared Web Hosting</option>
        </select>
      </div>
      
      <div>
        <label className={labelStyle}>User Plan</label>
        <select
          name="user_plan"
          value={formData.user_plan}
          onChange={handleChange}
          required
          disabled={!formData.serviceType}
          className={inputStyle}
        >
          <option value="">Select Plan</option>
          {formData.serviceType && servicePlanOptions[formData.serviceType]?.map((plan, index) => (
            <option key={index} value={plan}>
              {plan}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelStyle}>Plan for Year</label>
          <input 
          name='plan_for_year'
          type="number" 
          value={formData.plan_for_year} 
          onChange={handleChange} 
          min="0"
          required
          className={inputStyle} 
        />
        </div>
        
        {/* <div>
          <label className={labelStyle}>Number of VMs</label>
          <input 
            name="numVMs" 
            type="number" 
            min="1"
            value={formData.numVMs} 
            onChange={handleChange} 
            placeholder="Enter number of VMs"
            className={inputStyle} 
          />
          <p className="text-xs text-gray-500 mt-1">For Dedicated Web Hosting only</p>
        </div> */}
      </div>
    </div>
  </div>

  {/* Section 3: Pricing */}
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className={labelStyle}>Web Hosting Amount(₹)</label>
        <input 
          name="web_hosting_amount" 
          type="number" 
          step="0.01"
          value={formData.web_hosting_amount} 
          onChange={handleChange} 
          min="0"
          required
          className={inputStyle} 
        />
      </div>
      <div>
        <label className={labelStyle}>Email Hosting Amount(₹)</label>
        <input 
          name="email_hosting_amount" 
          type="number" 
          step="0.01"
          value={formData.email_hosting_amount} 
          onChange={handleChange} 
          min="0"
          required
          className={inputStyle} 
        />
      </div>
      {/* <div>
        <label className={labelStyle}>Discount (₹)</label>
        <input 
          name="discount" 
          type="number" 
          step="0.01"
          value={formData.discount} 
          onChange={handleChange} 
          min="0"
          className={inputStyle} 
        />
      </div> */}
      
    </div>
    <div className="mt-4 p-3 bg-blue-50 rounded-md">
      {/* <p className="text-sm text-blue-800">
        <strong>Final Amount: ₹{(parseFloat(formData.(totalAmount) || '0') - parseFloat(formData.discount || '0')).toFixed(2)}</strong>
      </p> */}
    </div>
  </div>

  {/* Section 4: Dates */}
  

  {/* Section 5: Service Duration */}
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Duration</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className={labelStyle}>Activation Date</label>
        <input 
          name="activation_date" 
          type="date" 
          value={formData.activation_date} 
          onChange={handleChange} 
          required 
          className={inputStyle} 
        />
      </div>
      <div>
        <label className={labelStyle}>Deactivation Date</label>
        <input 
          name="deactivation_date" 
          type="date" 
          value={formData.deactivation_date} 
          onChange={handleChange} 
          className={inputStyle} 
        />
        <p className="text-xs text-gray-500 mt-1">Leave empty for indefinite duration</p>
      </div>
    </div>
  </div>

  {/* Section 6: Tax Information */}
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className={labelStyle}>GST No.</label>
        <input 
          name="gstin" 
          value={formData.gstin} 
          onChange={handleChange} 
          placeholder="e.g., 22AAAAA0000A1Z5"
          className={inputStyle} 
        />
        <p className="text-xs text-gray-500 mt-1">Enter GST number if applicable</p>
      </div>
      <div>
        <label className={labelStyle}>TAN No.</label>
        <input 
          name="tan_no" 
          value={formData.tan_no} 
          onChange={handleChange} 
          placeholder="e.g., AAAA00000A"
          className={inputStyle} 
        />
        <p className="text-xs text-gray-500 mt-1">Enter TAN number if applicable</p>
      </div>
    </div>
  </div>

  {/* Submit Button */}
  <div className="text-center pt-6">
    <button
      type="submit"
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-8 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        </span>
      ) : (
        'Register User'
      )}
    </button>
  </div>
</form>
    </div>
  );
};

export default SubscriptionForm;