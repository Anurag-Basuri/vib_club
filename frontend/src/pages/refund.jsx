import React from 'react';
import { useNavigate } from 'react-router-dom';

const RefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-black text-white px-4 py-12 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-blue-950/80 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-blue-500/40">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold shadow transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-extrabold text-blue-400 mb-4 text-center tracking-tight drop-shadow">
          Refund & Cancellation Policy
        </h1>
        <p className="text-blue-200 mb-8 text-sm text-center">
          Effective from: <span className="text-blue-300 font-medium">July 2025</span>
        </p>
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300"></div>
        </div>
        <ol className="list-decimal pl-6 space-y-8 text-blue-100 text-base leading-relaxed">
          <li>
            <span className="font-semibold text-blue-300">Cancellation Requests:</span><br />
            <span className="text-blue-200">
              Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
            </span>
          </li>
          <li>
            <span className="font-semibold text-blue-300">No Cancellation After Registration:</span><br />
            <span className="text-blue-200">
              Once your registration for any VIBRANTA event is successfully completed and payment is processed, <b>it cannot be cancelled</b> under any circumstances. All registrations are considered final.
            </span>
          </li>
          <li>
            <span className="font-semibold text-blue-300">Perishable Items:</span><br />
            <span className="text-blue-200">
              We do not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
            </span>
          </li>
          <li>
            <span className="font-semibold text-blue-300">Damaged or Defective Items:</span><br />
            <span className="text-blue-200">
              In case of receipt of damaged or defective items, please report the same to our Customer Service team within <b>7 days</b> of receipt. The request will be entertained once the merchant has checked and determined the same at their end. If you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within <b>7 days</b> of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
            </span>
          </li>
          <li>
            <span className="font-semibold text-blue-300">Products with Manufacturer Warranty:</span><br />
            <span className="text-blue-200">
              For complaints regarding products that come with a warranty from manufacturers, please refer the issue to them directly.
            </span>
          </li>
          <li>
            <span className="font-semibold text-blue-300">Failed Payment Handling:</span><br />
            <span className="text-blue-200">
              If a payment attempt fails during checkout, the amount (if deducted) is <b>automatically refunded to your original payment source</b> by the payment gateway. This typically takes between <b>1 to 7 business days</b>, depending on your bank or UPI provider.
            </span>
          </li>
          <li>
            <span className="font-semibold text-blue-300">Unintended Payments:</span><br />
            <span className="text-blue-200">
              If you made a payment but were not registered successfully, you can choose to retry registration. However, if you decide not to register, you must inform us within <b>48 hours</b> by emailing us at <a href="mailto:vibranta.helpdesk@gmail.com" className="underline text-blue-300">vibranta.helpdesk@gmail.com</a>. In such cases, the team will verify the transaction and <b>initiate a full refund</b> within <b>5–7 business days</b>.
            </span>
          </li>
          <li>
            <span className="font-semibold text-blue-300">Incorrect or Duplicate Payments:</span><br />
            <span className="text-blue-200">
              In cases of accidental double payments or incorrect amounts, please report the issue within <b>24 hours</b>. Provide transaction proof and student details. Verified excess payments will be refunded after validation.
            </span>
          </li>
          <li>
            <span className="font-semibold text-blue-300">Refund Processing Time:</span><br />
            <span className="text-blue-200">
              In case of any refunds approved by the VIB Club, it will take <b>3–5 business days</b> for the refund to be processed to the end customer.
            </span>
          </li>
          <li>
            <span className="font-semibold text-blue-300">Disputes:</span><br />
            <span className="text-blue-200">
              All refund and cancellation-related disputes will be handled exclusively by the VIB Club management team. Their decision will be considered final in all cases.
            </span>
          </li>
          <li>
            <span className="font-semibold text-blue-300">How to Request Refunds:</span><br />
            <span className="text-blue-200">
              Email us at <a href="mailto:vibranta.helpdesk@gmail.com"
               className="underline text-blue-300">vibranta.helpdesk@gmail.com</a> with:
            </span>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-blue-200">
              <li>Your Full Name</li>
              <li>Event Name</li>
              <li>Payment Date</li>
              <li>Transaction ID / Screenshot</li>
              <li>Reason for refund (if applicable)</li>
            </ul>
          </li>
        </ol>
        <div className="mt-10 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
        </div>
        <p className="mt-8 text-sm text-center text-blue-300 italic">
          By registering, you agree to abide by these terms. Please read carefully before making payment.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;
