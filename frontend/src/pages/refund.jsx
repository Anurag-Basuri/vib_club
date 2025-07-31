import React from 'react';

const RefundPolicy = () => (
  <div className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-black text-white px-4 py-12 flex flex-col items-center">
    <div className="max-w-3xl w-full bg-blue-900/30 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-blue-500/40">
      <h1 className="text-4xl font-bold text-blue-400 mb-6 text-center">
        Refund & Cancellation Policy
      </h1>

      <p className="text-blue-200 mb-6 text-sm text-center">
        Effective from: <span className="text-blue-300 font-medium">July 2025</span>
      </p>

      <ol className="list-decimal pl-6 space-y-6 text-blue-100 text-base leading-relaxed">
        <li>
          <span className="font-semibold text-blue-300">No Cancellation After Registration:</span><br />
          Once your registration for any VIBRANTA event is successfully completed and payment is processed, **it cannot be cancelled** under any circumstances. All registrations are considered final.
        </li>

        <li>
          <span className="font-semibold text-blue-300">Failed Payment Handling:</span><br />
          If a payment attempt fails during checkout, the amount (if deducted) is **automatically refunded to your original payment source** by the payment gateway. This typically takes between **1 to 7 business days**, depending on your bank or UPI provider.
        </li>

        <li>
          <span className="font-semibold text-blue-300">Unintended Payments:</span><br />
          If you made a payment but were not registered successfully, you can choose to retry registration. However, if you decide not to register, you must inform us within **48 hours** by emailing us at <a href="mailto:vibranta.studorg@gmail.com" className="underline text-blue-300">vibranta.studorg@gmail.com</a>. In such cases, the team will verify the transaction and **initiate a full refund** within **5–7 business days**.
        </li>

        <li>
          <span className="font-semibold text-blue-300">Incorrect or Duplicate Payments:</span><br />
          In cases of accidental double payments or incorrect amounts, please report the issue within **24 hours**. Provide transaction proof and student details. Verified excess payments will be refunded after validation.
        </li>

        <li>
          <span className="font-semibold text-blue-300">Disputes:</span><br />
          All refund and cancellation-related disputes will be handled exclusively by the VIB Club management team. Their decision will be considered final in all cases.
        </li>

        <li>
          <span className="font-semibold text-blue-300">How to Request Refunds:</span><br />
          Email us at <a href="mailto:vibranta.studorg@gmail.com" className="underline text-blue-300">vibranta.studorg@gmail.com</a> with:
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>Your Full Name</li>
            <li>Event Name</li>
            <li>Payment Date</li>
            <li>Transaction ID / Screenshot</li>
            <li>Reason for refund (if applicable)</li>
          </ul>
        </li>
      </ol>

      <p className="mt-10 text-sm text-center text-blue-300 italic">
        By registering, you agree to abide by these terms. Please read carefully before making payment.
      </p>
    </div>
  </div>
);

export default RefundPolicy;
