import React from 'react';
import PrintButton from '@/components/PrintButton';
async function getInvoiceData(id: string) {
  const res = await fetch(`http://localhost:5000/api/invoice/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch invoice data');
  return res.json();
}

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const invoiceData = await getInvoiceData(params.id);
  return (
    <div className="max-w-4xl mx-auto my-6 border border-black p-4">
      {/* Header */}
      <div className="relative text-center py-1 border-b border-black font-bold text-blue-700">
        PROFORMA INVOICE
      </div>

      {/* Company Info */}
      <div className="flex border-b border-black">
        <div className="w-3/5 border-r border-black p-2 text-xs">
          <div className="font-bold text-xl text-blue-700">ERNET INDIA</div>
          <p>
            An autonomous scientific society of the Ministry of Electronics and Information Technology, Government of India.<br />
            5th floor Block I, A-wing, DMRC IT park, Shastri Park, Delhi - 110053<br />
            Tel: 011-22170644<br />
            Email: <span className="text-blue-700">sfo@ernet.in</span>, <span className="text-blue-700">webhosting@ernet.in</span>
          </p>
        </div>
        <div className="w-2/5 p-2 text-xs">
          <p><strong>Reference No.:</strong> {invoiceData.referenceNo}</p>
          <p><strong>Dated:</strong> {invoiceData.invoiceDate}</p>
          <p><strong>Buyer's Order No.:</strong> {invoiceData.referenceNo}</p>
        </div>
      </div>

      {/* Buyer Info */}
      <div className="flex border-b border-black">
        <div className="w-3/5 border-r border-black p-2 text-xs">
          <p><strong>Buyer (Bill to)</strong></p>
          <p>{invoiceData.username}</p>
          <p>{invoiceData.address}</p>
          <p>State: {invoiceData.state}</p>
          <p>GSTIN: {invoiceData.gstin || 'N/A'}</p>
        </div>
        <div className="w-2/5 p-2 text-xs">
          <p><strong>Terms of Delivery</strong></p>
          <p>As mentioned on the ERNET India's website.</p>
        </div>
      </div>

      {/* Service Table */}
      <div className="border-b border-black p-2">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1">Description</th>
              <th className="border border-black p-1">HSN/SAC</th>
              <th className="border border-black p-1">Qty</th>
              <th className="border border-black p-1">Rate</th>
              <th className="border border-black p-1">Per</th>
              <th className="border border-black p-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1">
                {invoiceData.serviceType} {invoiceData.plan} Plan<br />
                (Subscription Charges in Advance)
              </td>
              <td className="border border-black p-1 text-center">998422</td>
              <td className="border border-black p-1 text-center">{invoiceData.numVMs || 1}</td>
              <td className="border border-black p-1 text-center">{invoiceData.totalAmount}</td>
              <td className="border border-black p-1 text-center">Month</td>
              <td className="border border-black p-1 text-right">{invoiceData.totalAmount}</td>
            </tr>
            <tr>
              <td colSpan={5} className="border border-black p-1">Total (Excl. GST)</td>
              <td className="border border-black p-1 text-right">{invoiceData.totalAmount}</td>
            </tr>
            <tr>
              <td colSpan={5} className="border border-black p-1">Discount ({invoiceData.discount}%)</td>
              <td className="border border-black p-1 text-right">
                -{(parseFloat(invoiceData.totalAmount) * parseFloat(invoiceData.discount) / 100).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={5} className="border border-black p-1">IGST @18%</td>
              <td className="border border-black p-1 text-right">
                +{(parseFloat(invoiceData.totalAmount) * 0.18).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={5} className="border border-black p-1 font-bold">Total Payable</td>
              <td className="border border-black p-1 text-right font-bold">
                ₹{(parseFloat(invoiceData.totalAmount) * 1.18 - (parseFloat(invoiceData.totalAmount) * parseFloat(invoiceData.discount) / 100)).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-b border-black p-2 text-xs">
        <p><strong>Declaration:</strong> All payments via NEFT/RTGS to ERNET India.</p>
        <p>GST No.: 07AAATE0202A2ZS</p>
      </div>



      <div className="flex border-b border-black text-xs">
  {/* Left Side: Amount Chargeable & Declaration */}
  <div className="w-3/5 border-r border-black p-2">
    <p><span className="italic">Amount chargeable (in words)</span></p>
    <p className="font-bold italic mt-1">
      {invoiceData.amountInWords || 'Amount In Words Here'}
    </p>

    <p className="mt-2">
      ERNET India GST No. : <span className="font-bold italic">07AAATE0202A2ZS</span>
    </p>

    <p className="mt-2 font-bold">Declaration</p>
    <p className="italic">
      All payments shall be made by Demand Draft/NEFT/RTGS only drawn in favour of ERNET India,
      payable at New Delhi and sent to Finance Officer, ERNET India, 5th floor, Block-1, A-wing,
      DMRC IT park, Shastri Park, Delhi - 110053. / Tel:011-22170641.<br />
      Email: cfo@ernet.in, webhosting@ernet.in
    </p>
  </div>

  {/* Right Side: Bank Details */}
  <div className="w-2/5 p-2">
    <p className="font-bold italic">ERNET India's Bank Details</p>
    <p className="italic mt-1">
      Bank Name : <span className="font-bold">STATE BANK OF INDIA</span><br />
      A/c No. : <span className="font-bold">33892412527</span><br />
      Branch & IFSC Code : <span className="font-bold">Kashmere Gate & SBIN0005715</span><br />
      MICR code: <span className="font-bold">110002051</span><br />
      Branch code: <span className="font-bold">005715</span>
    </p>
  </div>
</div>



      <div className="text-center mt-4">
        <PrintButton />
      </div>
    </div>
  );
}
