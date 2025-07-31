import React from 'react';
import { useNavigate } from 'react-router-dom';

const termsList = [
  {
    title: "Eligibility",
    description:
      "Participation in VIBRANTA events and use of our services is open to eligible students, faculty, and invited guests of Lovely Professional University (LPU) only. Valid credentials or registration may be required."
  },
  {
    title: "Code of Conduct",
    description:
      "All participants must maintain respectful, inclusive, and responsible behavior. Any misconduct or violation of campus rules may result in removal without refund."
  },
  {
    title: "Registration",
    description:
      "Accurate personal and academic information is required for registration. Incomplete or fraudulent registrations may be rejected."
  },
  {
    title: "Payment and Invoicing",
    description:
      "Payments must be made via the official platform using supported gateways like Cashfree. Confirmation will be sent to your registered email."
  },
  {
    title: "Refund & Cancellation",
    description:
      "Fees are non-refundable unless explicitly stated. For details, refer to our separate Refund & Cancellation Policy page."
  },
  {
    title: "Event Changes",
    description:
      "VIBRANTA reserves the right to change event schedules, formats, venues, or cancel events due to unforeseen circumstances. Updates will be communicated via official channels."
  },
  {
    title: "Data Privacy & Security",
    description:
      "Your personal data is protected and used only for event communication, analytics, and updates. We do not sell data to third parties."
  },
  {
    title: "Photography & Media Consent",
    description:
      "By attending, you consent to being photographed or recorded for promotional purposes by VIBRANTA or LPU."
  },
  {
    title: "Health and Safety",
    description:
      "Attendees must follow all safety guidelines. VIBRANTA is not responsible for injuries, lost items, or damages during events."
  },
  {
    title: "Technical Glitches",
    description:
      "In case of technical issues (platform errors, payment glitches, etc.), VIBRANTA will attempt resolution but is not liable for delays or losses."
  },
  {
    title: "Liability Disclaimer",
    description:
      "Participation is voluntary. VIBRANTA, its members, and LPU are not responsible for any loss, damage, or injury during or after events."
  },
  {
    title: "Support and Dispute Resolution",
    description:
      "For support, contact vibclub@lpu.in. Disputes will be handled internally and escalated only if necessary."
  }
];

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black text-white px-4 py-16 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-blue-900/30 backdrop-blur-md rounded-2xl p-10 shadow-2xl border border-blue-500/40">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-blue-400 mb-6 text-center">
          Terms & Conditions
        </h1>

        <p className="text-blue-200 mb-6 text-sm text-center">
          Effective from: <span className="text-blue-300 font-medium">July 2025</span>
        </p>

        <ol className="list-decimal pl-6 space-y-6 text-blue-100 text-base leading-relaxed">
          {termsList.map((term, index) => (
            <li key={index}>
              <span className="font-semibold text-blue-300">{term.title}:</span><br />
              {term.description}
            </li>
          ))}
        </ol>

        <p className="mt-10 text-sm text-center text-blue-300 italic">
          By participating in our events or using our services, you fully agree to these Terms & Conditions. For any queries, contact us at{' '}
          <a href="mailto:vibclub@lpu.in" className="underline text-blue-400">vibclub@lpu.in</a>.
        </p>
      </div>
    </div>
  );
};

export default Terms;
