'use client';

import React, { useState } from 'react';

const AddWebHostingUser: React.FC = () => {
  const [formData, setFormData] = useState({
    userName: '',
    hostingType: '',      // Dedicated / Shared
    tariffPlan: '',
    yearlyAmount: '',
    activationDate: '',
    email: '',
    contactPerson: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit Single User
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/add-webhosting-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || '❌ Failed to add user');
        return;
      }

      alert('✅ Web Hosting User added successfully!');
      setFormData({
        userName: '',
        hostingType: '',
        tariffPlan: '',
        yearlyAmount: '',
        activationDate: '',
        email: '',
        contactPerson: '',
      });
    } catch (error) {
      alert('❌ An error occurred while submitting.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle File Input Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Bulk Upload Handler
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('⚠️ Please select an Excel file first!');
      return;
    }

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert('❌ Invalid file type. Please upload a valid Excel file.');
      return;
    }

    setUploading(true);
    const formPayload = new FormData();
    formPayload.append('file', selectedFile);

    try {
      const res = await fetch('http://localhost:5000/api/bulk-upload-webhosting', {
        method: 'POST',
        body: formPayload,
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ ${data.message} (${data.count} users uploaded)`);
        setSelectedFile(null);
        (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
      } else {
        console.error('Backend Error:', data);
        alert(data.message || '❌ Upload failed.');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      alert('❌ An error occurred during file upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Web Hosting User</h2>

      {/* Single User Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[ 
          { label: 'User Name', name: 'userName', type: 'text' },
          { label: 'Tariff Plan', name: 'tariffPlan', type: 'text' },
          { label: 'Yearly Amount (As per Tariff Plan)', name: 'yearlyAmount', type: 'number' },
          { label: 'Date of Activation', name: 'activationDate', type: 'date' },
          { label: 'Email Address', name: 'email', type: 'email' },
          { label: 'Contact Person (Technical)', name: 'contactPerson', type: 'text' },
        ].map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={(formData as any)[field.name]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium">Dedicated / Shared</label>
          <select
            name="hostingType"
            value={formData.hostingType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="Dedicated">Dedicated</option>
            <option value="Shared">Shared</option>
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      {/* Divider */}
      <hr className="my-6" />

      {/* Bulk Upload Section */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2 text-lg">Upload Web Hosting Users via Excel</h3>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="mb-3"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {uploading ? 'Uploading...' : 'Upload Excel'}
        </button>
      </div>
    </div>
  );
};

export default AddWebHostingUser;
