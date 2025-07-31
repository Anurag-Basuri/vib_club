import React, { useEffect } from 'react';
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

  // Hide navbar when this page is open
  useEffect(() => {
    const navbar = document.querySelector('[data-navbar]');
    if (navbar) navbar.style.display = 'none';
    return () => {
      if (navbar) navbar.style.display = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white py-16 px-6 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-gray-900/90 rounded-2xl p-10 shadow-xl border border-red-700/30">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-red-500 mb-6 text-center">
          Terms & Conditions
        </h1>
        <p className="text-center text-red-300 mb-10">
          These Terms & Conditions apply to all VIBRANTA events, registrations, and services. Please read carefully before participating.
        </p>

        <div className="space-y-6">
          {termsList.map((term, index) => (
            <div key={index} className="border-b border-red-700/30 pb-4">
              <h3 className="text-xl font-semibold text-red-400 mb-2">{index + 1}. {term.title}</h3>
              <p className="text-red-100 leading-relaxed">{term.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-red-400">
          By participating in our events or using our services, you fully agree to these Terms & Conditions. For any queries, contact us at{" "}
          <a href="mailto:vibclub@lpu.in" className="underline text-red-300">vibclub@lpu.in</a>.
        </p>
      </div>
    </div>
  );
};

export default Terms;