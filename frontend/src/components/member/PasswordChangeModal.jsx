import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';

const PasswordChangeModal = ({ isOpen, onClose, onChangePassword, loading }) => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showOld, setShowOld] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const resetFields = () => {
		setOldPassword('');
		setNewPassword('');
		setConfirmPassword('');
		setShowOld(false);
		setShowNew(false);
		setShowConfirm(false);
	};

	const handleClose = () => {
		if (!submitting && !loading) {
			resetFields();
			onClose();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!oldPassword || !newPassword || !confirmPassword) {
			toast.error('All fields are required', { icon: '❌' });
			return;
		}
		if (newPassword.length < 8) {
			toast.error('New password must be at least 8 characters', { icon: '🔒' });
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error('Passwords do not match', { icon: '❌' });
			return;
		}
		setSubmitting(true);
		try {
			await onChangePassword(oldPassword, newPassword);
			handleClose();
		} catch (err) {
			toast.error('Failed to change password', { icon: '❌' });
		} finally {
			setSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<motion.form
				initial={{ opacity: 0, scale: 0.95, y: 30 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 30 }}
				onSubmit={handleSubmit}
				className="glass-card p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-blue-400/20 relative"
			>
				<button
					type="button"
					onClick={handleClose}
					className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
					aria-label="Close modal"
					disabled={submitting || loading}
				>
					<FiX className="w-5 h-5" />
				</button>
				<div className="flex items-center mb-4">
					<div className="bg-blue-500/20 text-blue-400 rounded-full p-2 mr-3">
						<FiShield className="w-6 h-6" />
					</div>
					<h3 className="text-lg font-bold text-blue-200">Change Password</h3>
				</div>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">
							Old Password
						</label>
						<div className="relative">
							<input
								type={showOld ? 'text' : 'password'}
								className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300 pr-10"
								value={oldPassword}
								onChange={(e) => setOldPassword(e.target.value)}
								autoComplete="current-password"
								placeholder="Enter old password"
								disabled={submitting || loading}
							/>
							<button
								type="button"
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400"
								onClick={() => setShowOld((v) => !v)}
								tabIndex={-1}
								aria-label={showOld ? 'Hide password' : 'Show password'}
							>
								{showOld ? (
									<FiEyeOff className="w-5 h-5" />
								) : (
									<FiEye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">
							New Password
						</label>
						<div className="relative">
							<input
								type={showNew ? 'text' : 'password'}
								className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300 pr-10"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								autoComplete="new-password"
								placeholder="At least 8 characters"
								disabled={submitting || loading}
							/>
							<button
								type="button"
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400"
								onClick={() => setShowNew((v) => !v)}
								tabIndex={-1}
								aria-label={showNew ? 'Hide password' : 'Show password'}
							>
								{showNew ? (
									<FiEyeOff className="w-5 h-5" />
								) : (
									<FiEye className="w-5 h-5" />
								)}
							</button>
						</div>
						<p className="text-xs text-gray-400 mt-1">
							Minimum 8 characters. Use a strong password.
						</p>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-1">
							Confirm New Password
						</label>
						<div className="relative">
							<input
								type={showConfirm ? 'text' : 'password'}
								className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300 pr-10"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								autoComplete="new-password"
								placeholder="Re-enter new password"
								disabled={submitting || loading}
							/>
							<button
								type="button"
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400"
								onClick={() => setShowConfirm((v) => !v)}
								tabIndex={-1}
								aria-label={showConfirm ? 'Hide password' : 'Show password'}
							>
								{showConfirm ? (
									<FiEyeOff className="w-5 h-5" />
								) : (
									<FiEye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>
				</div>
				<div className="flex justify-end space-x-2 mt-6">
					<motion.button
						type="button"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleClose}
						className="px-4 py-2 rounded-lg bg-gray-700/60 hover:bg-gray-600 text-gray-200 border border-gray-500/30 transition-all duration-200"
						disabled={submitting || loading}
					>
						Cancel
					</motion.button>
					<motion.button
						type="submit"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow border border-blue-400/30 transition-all duration-200 flex items-center space-x-2 disabled:opacity-60"
						disabled={submitting || loading}
					>
						{(submitting || loading) && (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
								className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
							/>
						)}
						<span>{submitting || loading ? 'Changing...' : 'Change Password'}</span>
					</motion.button>
				</div>
			</motion.form>
		</div>
	);
};

export default PasswordChangeModal;
