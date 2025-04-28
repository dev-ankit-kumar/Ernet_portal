'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const OTPVerificationPage: React.FC = () => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [timer, setTimer] = useState(30);
  const [message, setMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);

  // Get phone number from localStorage
  useEffect(() => {
    const storedPhone = localStorage.getItem('userPhone');
    if (!storedPhone) {
      router.push('/login');
    } else {
      setPhone(storedPhone);
    }
  }, []);

  // Timer logic for Resend button
  useEffect(() => {
    let countdown: any;
    if (resendDisabled && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [resendDisabled, timer]);

  const handleVerify = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');

      localStorage.setItem('isLoggedIn', 'true');
      setMessage('✅ Login successful!');
      setTimeout(() => router.push('/homepage'), 1000);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');

      setMessage('📨 OTP resent successfully');
      setResendDisabled(true);
      setTimer(30); // restart timer
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Verify OTP</h2>

        <p className="text-sm text-center text-gray-500 mb-4">Sent to {phone}</p>

        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-3"
        >
          Verify OTP
        </button>

        <button
          onClick={handleResend}
          disabled={resendDisabled}
          className={`w-full py-2 rounded transition ${
            resendDisabled
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {resendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
        </button>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default OTPVerificationPage;
