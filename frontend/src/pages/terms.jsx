import React from 'react';


const termsList = [
  {
    title: "Eligibility",
    description:
      "Only students, faculty, or invited guests of Lovely Professional University (LPU) with valid credentials are eligible to participate in any VIBRANTA event."
  },
  {
    title: "Code of Conduct",
    description:
      "All participants are expected to maintain respectful, inclusive, and responsible behavior throughout the event. Any violation may lead to removal from the event without any refund."
  },
  {
    title: "Event Registration",
    description:
      "Registration is mandatory for all events. Ensure accurate personal and academic information during registration. VIBRANTA reserves the right to reject incomplete or fraudulent registrations."
  },
  {
    title: "Payment and Invoicing",
    description:
      "All payments must be made via the official platform using supported gateways like Cashfree. An invoice or confirmation will be shared via registered email."
  },
  {
    title: "Refund & Cancellation",
    description:
      "Once paid, fees are non-refundable unless explicitly mentioned. Visit our Refund Policy for specific event exceptions or contact support."
  },
  {
    title: "Event Changes",
    description:
      "VIBRANTA reserves the right to change the event schedule, format, venue, or cancel events due to unforeseen circumstances. All changes will be communicated via our official platform or email."
  },
  {
    title: "Data Privacy & Security",
    description:
      "We are committed to protecting your personal data. Information collected will only be used for communication, analytics, and event-related updates. No data will be sold to third parties."
  },
  {
    title: "Photography & Media Consent",
    description:
      "By attending, you grant permission to be photographed, recorded, or featured in promotional material used by VIBRANTA or LPU."
  },
  {
    title: "Health and Safety",
    description:
      "Attendees must comply with all safety guidelines. VIBRANTA is not responsible for any injuries, lost items, or damage incurred during the event."
  },
  {
    title: "Technical Glitches",
    description:
      "In case of technical failures (platform errors, payment glitches, etc.), VIBRANTA will attempt resolution but holds no liability for delays or losses."
  },
  {
    title: "Liability Disclaimer",
    description:
      "Participation is voluntary. VIBRANTA, its members, and LPU shall not be held responsible for any loss, damage, or injury during or after the event."
  },
  {
    title: "Support and Dispute Resolution",
    description:
      "All support requests can be directed to vibclub@lpu.in. Disputes will be handled internally and escalated only if necessary."
  }
];


const Terms = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white py-16 px-6 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-gray-900/90 rounded-2xl p-10 shadow-xl border border-red-700/30">
        <h1 className="text-4xl font-bold text-red-500 mb-6 text-center">
          Terms & Conditions
        </h1>
        <p className="text-center text-red-300 mb-10">
          These terms apply to all VIBRANTA events, registrations, and services. Please read carefully before participating.
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
          By participating in our events or using our services, you fully agree to the terms outlined above. For any queries, contact us at{" "}
          <a href="mailto:vibclub@lpu.in" className="underline text-red-300">vibclub@lpu.in</a>.
        </p>
      </div>
    </div>
  );
};

export default Terms;