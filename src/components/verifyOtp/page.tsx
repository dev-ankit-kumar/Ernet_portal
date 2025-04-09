'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');

  const handleVerify = async () => {
    const res = await fetch('http://localhost:5000/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, otp }),
    });

    const data = await res.json();

    if (data.status === 'success') {
      setMessage('✅ OTP Verified! Access granted.');
    } else {
      setMessage('❌ Invalid OTP');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">Verify OTP</h1>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />
      <button
        onClick={handleVerify}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        Verify
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
