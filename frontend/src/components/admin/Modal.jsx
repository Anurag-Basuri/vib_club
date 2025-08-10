import React from "react";
import { motion } from "framer-motion";

const Modal = ({ children, title, onClose, width = "max-w-md" }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <motion.div
      className={`bg-gray-800 rounded-xl p-6 w-full ${width} border border-gray-700 shadow-2xl`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          &times;
        </button>
      </div>
      {children}
    </motion.div>
  </div>
);

export default Modal;