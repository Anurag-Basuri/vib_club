import React from "react";
import { motion } from "framer-motion";
import { User, Users, Mail, LogOut, ShieldCheck } from "lucide-react";
import Logo from "../assets/logo.png";

const dummyAdmin = {
  fullname: "Anurag Sharma",
  adminID: "admin-12345",
  email: "anurag@vibranta.edu",
  lastLogin: "2025-08-06 10:32 AM",
};

const dummyStats = [
  { label: "Total Members", value: 142, icon: <Users className="h-6 w-6" /> },
  { label: "Leaders", value: 8, icon: <ShieldCheck className="h-6 w-6" /> },
  { label: "Contact Requests", value: 5, icon: <Mail className="h-6 w-6" /> },
];

const AdminDash = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] to-[#1a1f3a] py-12 px-4 flex flex-col items-center">
      <motion.div
        className="w-full max-w-3xl bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 p-8 border-b border-white/10 bg-gradient-to-r from-[#3a56c9]/10 to-[#5d7df5]/10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden border-2 border-cyan-400/40 bg-black/70 relative">
            <img src={Logo} alt="Vibranta Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#3a56c9] via-[#5d7df5] to-[#8e2de2] bg-clip-text text-transparent tracking-wide">
              Vibranta Admin
            </h1>
            <p className="text-white/70 text-sm mt-1">Welcome, {dummyAdmin.fullname}</p>
          </div>
        </div>
        <div className="p-8 flex flex-col md:flex-row gap-8">
          {/* Admin Profile */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg mb-2">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{dummyAdmin.fullname}</h2>
              <p className="text-slate-300 text-sm">Admin ID: <span className="font-mono">{dummyAdmin.adminID}</span></p>
              <p className="text-slate-300 text-sm">Email: <span className="font-mono">{dummyAdmin.email}</span></p>
              <p className="text-slate-400 text-xs mt-2">Last Login: {dummyAdmin.lastLogin}</p>
            </div>
            <button
              className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold flex items-center gap-2 shadow hover:from-red-600 hover:to-pink-600 transition-all"
              onClick={() => alert("Logged out!")}
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
          {/* Stats */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {dummyStats.map((stat, idx) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-gradient-to-br from-[#3a56c9]/30 to-[#5d7df5]/20 p-6 flex flex-col items-center shadow-lg border border-white/10"
              >
                <div className="mb-2 text-cyan-300">{stat.icon}</div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-200 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export