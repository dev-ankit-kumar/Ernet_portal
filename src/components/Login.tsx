'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'enter-phone' | 'verify-otp'>('enter-phone');
  const router = useRouter();

  const handleSendOtp = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
  
      localStorage.setItem('userPhone', phone); // ✅ store it for use in /verify
      router.push('/verify'); // ✅ redirect to OTP verification page
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong');
    }
  };
  

  const handleVerifyOtp = async () => {
    setMessage('');
    const res = await fetch('http://localhost:5000/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.message);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userPhone', phone);
    router.push('/homepage');
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Login via OTP</h2>
      <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-2 border mb-4 rounded"
        placeholder="Enter phone number"
      />
      {step === 'verify-otp' && (
        <>
          <label className="block mb-1 text-sm font-medium text-gray-700">Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border mb-4 rounded"
            placeholder="Enter OTP"
          />
        </>
      )}

      <button
        onClick={step === 'enter-phone' ? handleSendOtp : handleVerifyOtp}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {step === 'enter-phone' ? 'Send OTP' : 'Verify OTP'}
      </button>

      {message && <p className="text-center mt-4 text-sm text-blue-600">{message}</p>}
    </div>
  );
};

export default LoginPage;
