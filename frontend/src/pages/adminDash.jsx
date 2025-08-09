import React from "react";
import { motion } from "framer-motion";
import { User, Users, Mail, LogOut, ShieldCheck } from "lucide-react";
import { publicClient } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.js";

const AdminDash = () => {
    const {user, loading, logoutAdmin} = useAuth();
    const 
    const handleLogout = async () => {
        try {
            await logoutAdmin();
            window.location.href = '/admin/auth';
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
};

export default AdminDash;