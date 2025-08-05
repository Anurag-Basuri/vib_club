import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { publicClient } from '../services/api.js';
import Logo from "../assets/logo.png";

const AdminAuthPage = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [adminData, setAdminData] = useState({ fullname: "", password: "" });
  const [memberData, setMemberData] = useState({
    name: "",
    lpuID: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [memberError, setMemberError] = useState("");
  const [memberSuccess, setMemberSuccess] = useState("");
  const navigate = useNavigate();

  // Dummy handlers (replace with real API calls)
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAdminError("");
        // TODO: Replace with real API call

        setTimeout(() => {
            if (adminData.fullname === "admin" && adminData.password === "admin") {
                navigate("/admin/dashboard");
            } else {
                setAdminError("Invalid admin credentials");
            }
            setLoading(false);
        }, 1000);
    };

  const handleMemberRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMemberError("");
    setMemberSuccess("");
    // TODO: Replace with real API call
    setTimeout(() => {
      if (
        memberData.name &&
        memberData.lpuID &&
        memberData.email &&
        memberData.password.length >= 6
      ) {
        setMemberSuccess("Registration successful! You can now login.");
        setMemberData({ name: "", lpuID: "", email: "", password: "" });
      } else {
        setMemberError("Please fill all fields and use a strong password.");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] to-[#1a1f3a] flex items-center justify-center py-12 px-4">
      <motion.div
        className="w-full max-w-2xl bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center items-center gap-4 mb-4 mt-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden border-2 border-cyan-400/40 bg-black/70 relative">
            <img
              src={Logo}
              alt="Vibranta Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <motion.h1
            className="text-4xl font-extrabold bg-gradient-to-r from-[#3a56c9] via-[#5d7df5] to-[#8e2de2] bg-clip-text text-transparent tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Vibranta
          </motion.h1>
        </div>
        <div className="flex border-b border-white/20 bg-gradient-to-r from-[#3a56c9]/10 to-[#5d7df5]/10">
          <button
            className={`flex-1 py-5 text-center font-semibold text-lg cursor-pointer transition-all relative ${
              activeTab === "admin"
                ? "text-white"
                : "text-white/70 hover:text-white/90"
            }`}
            onClick={() => setActiveTab("admin")}
          >
            Admin Login
            {activeTab === "admin" && (
              <span className="absolute bottom-0 left-1/4 w-1/2 h-1 rounded-full bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] animate-pulse" />
            )}
          </button>
          <button
            className={`flex-1 py-5 text-center font-semibold text-lg cursor-pointer transition-all relative ${
              activeTab === "member"
                ? "text-white"
                : "text-white/70 hover:text-white/90"
            }`}
            onClick={() => setActiveTab("member")}
          >
            Member Register
            {activeTab === "member" && (
              <span className="absolute bottom-0 left-1/4 w-1/2 h-1 rounded-full bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] animate-pulse" />
            )}
          </button>
        </div>
        <div className="p-8 md:p-12 bg-gradient-to-br from-white/5 via-[#0a0e17]/10 to-[#1a1f3a]/10">
          <AnimatePresence mode="wait">
            {activeTab === "admin" ? (
              <motion.form
                key="admin"
                className="flex flex-col gap-6"
                onSubmit={handleAdminLogin}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl mb-2 text-center font-bold bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] bg-clip-text text-transparent">
                  Admin Login
                </h2>
                {adminError && (
                  <motion.div
                    className="text-red-400 text-center font-medium py-2 px-4 rounded-lg bg-red-900/20"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {adminError}
                  </motion.div>
                )}
                <div>
                  <label className="block mb-2 font-medium text-white/90">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    required
                    value={adminData.fullname}
                    onChange={(e) =>
                      setAdminData((prev) => ({
                        ...prev,
                        fullname: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white text-base transition-all focus:outline-none focus:border-[#5d7df5] focus:ring-2 focus:ring-[#5d7df5]/30 hover:bg-black/40"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-white/90">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={adminData.password}
                    onChange={(e) =>
                      setAdminData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white text-base transition-all focus:outline-none focus:border-[#5d7df5] focus:ring-2 focus:ring-[#5d7df5]/30 hover:bg-black/40"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3a56c9] to-[#5d7df5] text-white font-semibold text-lg cursor-pointer shadow-lg relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="member"
                className="flex flex-col gap-6"
                onSubmit={handleMemberRegister}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl mb-2 text-center font-bold bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] bg-clip-text text-transparent">
                  Member Registration
                </h2>
                {memberError && (
                  <motion.div
                    className="text-red-400 text-center font-medium py-2 px-4 rounded-lg bg-red-900/20"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {memberError}
                  </motion.div>
                )}
                {memberSuccess && (
                  <motion.div
                    className="text-green-400 text-center font-medium py-2 px-4 rounded-lg bg-green-900/20"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {memberSuccess}
                  </motion.div>
                )}
                <div>
                  <label className="block mb-2 font-medium text-white/90">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={memberData.name}
                    onChange={(e) =>
                      setMemberData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white text-base transition-all focus:outline-none focus:border-[#5d7df5] focus:ring-2 focus:ring-[#5d7df5]/30 hover:bg-black/40"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-white/90">
                    LPU ID
                  </label>
                  <input
                    type="text"
                    name="lpuID"
                    required
                    value={memberData.lpuID}
                    onChange={(e) =>
                      setMemberData((prev) => ({
                        ...prev,
                        lpuID: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white text-base transition-all focus:outline-none focus:border-[#5d7df5] focus:ring-2 focus:ring-[#5d7df5]/30 hover:bg-black/40"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-white/90">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={memberData.email}
                    onChange={(e) =>
                      setMemberData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white text-base transition-all focus:outline-none focus:border-[#5d7df5] focus:ring-2 focus:ring-[#5d7df5]/30 hover:bg-black/40"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-white/90">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={memberData.password}
                    onChange={(e) =>
                      setMemberData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white text-base transition-all focus:outline-none focus:border-[#5d7df5] focus:ring-2 focus:ring-[#5d7df5]/30 hover:bg-black/40"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5d7df5] to-[#3a56c9] text-white font-semibold text-lg cursor-pointer shadow-lg relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    "Register"
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuthPage;