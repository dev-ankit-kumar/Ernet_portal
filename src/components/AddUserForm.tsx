'use client';

import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';



// Inside handleSubmit after successful API call



interface FormData {
  username: string;
  state: string;
  serviceType: string;
  plan: string;
  additionalResources: string;
  totalAmount: string;
  discount: string;
  piDate: string;
  invoiceDate: string;
  address: string;
  gstin: string;
  numVMs: string;
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

  const [formData, setFormData] = useState<FormData>({
    username: '',
    state: '',
    serviceType: '',
    plan: '',
    additionalResources: '',
    totalAmount: '',
    discount: '0',
    piDate: '',
    invoiceDate: '',
    address: '',
    gstin: '',
    numVMs: '',
  });


  const invoiceRef = useRef<HTMLDivElement>(null);


  const [isLoading, setIsLoading] = useState(false);
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
  
  // const generatePDF = async () => {
  //   const element = invoiceRef.current;
  //   if (!element) return;
  
  //   try {
  //     const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF();
  //     pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
  //     pdf.save(`Proforma_Invoice_${formData.username}.pdf`);
  //   } catch (err) {
  //     console.error('PDF Generation Failed:', err);
  //   }
  // };
  


 

  const labelStyle = 'block text-sm font-medium text-gray-700 mb-1';
  const inputStyle =
    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400';

  return (
    
    <div className="bg-white p-6 md:p-8 shadow-md rounded-lg max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Add New User</h2>

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
        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelStyle}>Username</label>
            <input name="username" value={formData.username} onChange={handleChange} required className={inputStyle} />
          </div>

          <div>
            <label className={labelStyle}>State</label>
            <select name="state" value={formData.state} onChange={handleChange} required className={inputStyle}>
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Service Type</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
              className={inputStyle}
            >
              <option value="">Select Service</option>
              {Object.keys(servicePlanOptions).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 2: Plan & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelStyle}>Plan</label>
            <select
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              required
              disabled={!formData.serviceType}
              className={inputStyle}
            >
              <option value="">Select Plan</option>
              {(servicePlanOptions[formData.serviceType] || []).map((plan) => (
                <option key={plan}>{plan}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>GSTIN / UIN</label>
            <input name="gstin" value={formData.gstin} onChange={handleChange} className={inputStyle} />
          </div>

          <div>
            <label className={labelStyle}>Number of VMs</label>
            <input
              name="numVMs"
              type="number"
              value={formData.numVMs}
              onChange={handleChange}
              className={inputStyle}
              placeholder="e.g. 5"
            />
          </div>
        </div>

        {/* Section 3: Address & Financials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelStyle}>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className={inputStyle} />
          </div>

          <div>
            <label className={labelStyle}>Total Amount</label>
            <input name="totalAmount" type="number" value={formData.totalAmount} onChange={handleChange} required className={inputStyle} />
          </div>

          <div>
            <label className={labelStyle}>Discount (%)</label>
            <input name="discount" type="number" value={formData.discount} onChange={handleChange} className={inputStyle} />
          </div>
        </div>

        {/* Section 4: Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>PI Date</label>
            <input name="piDate" type="date" value={formData.piDate} onChange={handleChange} required className={inputStyle} />
          </div>

          <div>
            <label className={labelStyle}>Invoice Date</label>
            <input name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleChange} required className={inputStyle} />
          </div>
        </div>

        {/* Additional Resources */}
        <div>
          <label className={labelStyle}>Additional Resources</label>
          <textarea
            name="additionalResources"
            value={formData.additionalResources}
            onChange={handleChange}
            rows={2}
            className={inputStyle}
          />
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
  );
};

export default SubscriptionForm;
