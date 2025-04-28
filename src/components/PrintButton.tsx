'use client';

import React from 'react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-blue-700 text-white px-4 py-2 rounded"
    >
      Print Invoice
    </button>
  );
}
