import React, { useState, useEffect } from 'react';
import {
	AcademicCapIcon,
	BuildingOfficeIcon,
	EnvelopeIcon,
	LockClosedIcon,
	GlobeAltIcon,
	PencilIcon,
	CameraIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { memberService } from '../services/api';

const MemberProfile = () => {
	const { member, updateMember } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		fullname: '',
		email: '',
		program: '',
		year: '',
		bio: '',
		socialLinks: [],
	});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	useEffect(() => {
		if (member) {
			setFormData({
				fullname: member.fullname || '',
				email: member.email || '',
				program: member.program || '',
				year: member.year || '',
				bio: member.bio || '',
				socialLinks: member.socialLinks || [],
			});
		}
	}, [member]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSocialLinkChange = (index, field, value) => {
		const updatedLinks = [...formData.socialLinks];
		updatedLinks[index][field] = value;
		setFormData((prev) => ({
			...prev,
			socialLinks: updatedLinks,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const updatedMember = await memberService.updateProfile(member._id, formData);
			updateMember(updatedMember);
			setMessage('Profile updated successfully!');
			setIsEditing(false);
			setTimeout(() => setMessage(''), 3000);
		} catch (error) {
			setMessage('Error updating profile');
		}
		setLoading(false);
	};

	const handleProfilePictureUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		try {
			setLoading(true);
			const formData = new FormData();
			formData.append('profilePicture', file);

			const updatedMember = await memberService.uploadProfilePicture(formData);
			updateMember(updatedMember);
			setMessage('Profile picture updated successfully!');
			setTimeout(() => setMessage(''), 3000);
		} catch (error) {
			setMessage('Error uploading profile picture');
		}
		setLoading(false);
	};

	if (!member) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black flex items-center justify-center">
				<div className="animate-pulse text-white text-xl">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-5xl mx-auto">
				{/* Status Messages */}
				{message && (
					<div className="mb-6 bg-blue-500/20 border border-blue-500/50 text-blue-200 px-4 py-3 rounded-lg backdrop-blur-sm">
						{message}
					</div>
				)}

				{/* Profile Header */}
				<div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10 shadow-2xl shadow-blue-500/10 animate-breathing">
					<div className="flex flex-col md:flex-row items-center">
						<div className="relative mb-4 md:mb-0 md:mr-6">
							<div className="w-32 h-32 rounded-full bg-blue-900/50 border-4 border-blue-600/30 overflow-hidden">
								{member.profilePicture?.url ? (
									<img
										src={member.profilePicture.url}
										alt={member.fullname}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-blue-800/20">
										<span className="text-4xl text-blue-400/60 font-bold">
											{member.fullname?.charAt(0).toUpperCase()}
										</span>
									</div>
								)}
							</div>
							<label
								htmlFor="profilePicture"
								className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 transition-all"
							>
								<CameraIcon className="h-5 w-5 text-white" />
								<input
									id="profilePicture"
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleProfilePictureUpload}
								/>
							</label>
						</div>

						<div className="text-center md:text-left flex-1">
							<h1 className="text-3xl font-bold text-white mb-2">
								{member.fullname}
							</h1>
							<div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
								<span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center">
									<BuildingOfficeIcon className="h-4 w-4 mr-1" />
									{member.department}
								</span>
								<span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center">
									<AcademicCapIcon className="h-4 w-4 mr-1" />
									{member.designation}
								</span>
								{member.status !== 'active' && (
									<span className="bg-red-600/20 text-red-300 px-3 py-1 rounded-full text-sm">
										{member.status.toUpperCase()}
									</span>
								)}
							</div>

							<div className="flex flex-wrap gap-4 text-gray-300">
								<div className="flex items-center">
									<EnvelopeIcon className="h-5 w-5 mr-1 text-blue-400" />
									<span>{member.email || 'No email provided'}</span>
								</div>
								<div className="flex items-center">
									<LockClosedIcon className="h-5 w-5 mr-1 text-blue-400" />
									<span>{member.LpuId}</span>
								</div>
							</div>
						</div>

						<button
							onClick={() => setIsEditing(!isEditing)}
							className="mt-4 md:mt-0 flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all"
						>
							<PencilIcon className="h-5 w-5 mr-2" />
							{isEditing ? 'Cancel Editing' : 'Edit Profile'}
						</button>
					</div>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Personal Information */}
					<div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
						<h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-white/10">
							Personal Information
						</h2>

						{isEditing ? (
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label className="block text-gray-300 mb-2">Full Name</label>
									<input
										type="text"
										name="fullname"
										value={formData.fullname}
										onChange={handleInputChange}
										className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="block text-gray-300 mb-2">Email</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="block text-gray-300 mb-2">Program</label>
									<input
										type="text"
										name="program"
										value={formData.program}
										onChange={handleInputChange}
										className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="block text-gray-300 mb-2">Year</label>
									<select
										name="year"
										value={formData.year}
										onChange={handleInputChange}
										className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="">Select Year</option>
										<option value="1">First Year</option>
										<option value="2">Second Year</option>
										<option value="3">Third Year</option>
										<option value="4">Fourth Year</option>
									</select>
								</div>

								<div>
									<label className="block text-gray-300 mb-2">Bio</label>
									<textarea
										name="bio"
										value={formData.bio}
										onChange={handleInputChange}
										rows="3"
										className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div className="pt-4">
									<button
										type="submit"
										disabled={loading}
										className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-all flex items-center justify-center"
									>
										{loading ? 'Saving...' : 'Save Changes'}
									</button>
								</div>
							</form>
						) : (
							<div className="space-y-4">
								<div>
									<span className="text-gray-400">Program:</span>
									<p className="text-white">
										{member.program || 'Not specified'}
									</p>
								</div>

								<div>
									<span className="text-gray-400">Year:</span>
									<p className="text-white">
										{member.year ? `Year ${member.year}` : 'Not specified'}
									</p>
								</div>

								<div>
									<span className="text-gray-400">Hosteler:</span>
									<p className="text-white">{member.hosteler ? 'Yes' : 'No'}</p>
								</div>

								{member.hosteler && member.hostel && (
									<div>
										<span className="text-gray-400">Hostel:</span>
										<p className="text-white">{member.hostel}</p>
									</div>
								)}

								<div>
									<span className="text-gray-400">Bio:</span>
									<p className="text-white mt-1">
										{member.bio || 'No bio provided'}
									</p>
								</div>

								<div>
									<span className="text-gray-400">Member Since:</span>
									<p className="text-white">
										{new Date(member.joinedAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Social Links & Additional Info */}
					<div className="space-y-8">
						{/* Social Links */}
						<div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
							<h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-white/10 flex items-center">
								<GlobeAltIcon className="h-5 w-5 mr-2" />
								Social Links
							</h2>

							{isEditing ? (
								<div className="space-y-4">
									{formData.socialLinks.map((link, index) => (
										<div key={index} className="flex space-x-2">
											<input
												type="text"
												placeholder="Platform"
												value={link.platform}
												onChange={(e) =>
													handleSocialLinkChange(
														index,
														'platform',
														e.target.value
													)
												}
												className="flex-1 bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
											<input
												type="url"
												placeholder="URL"
												value={link.url}
												onChange={(e) =>
													handleSocialLinkChange(
														index,
														'url',
														e.target.value
													)
												}
												className="flex-1 bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>
									))}

									<button
										type="button"
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												socialLinks: [
													...prev.socialLinks,
													{ platform: '', url: '' },
												],
											}))
										}
										className="text-blue-400 hover:text-blue-300 text-sm"
									>
										+ Add Another Link
									</button>
								</div>
							) : (
								<div className="space-y-3">
									{member.socialLinks && member.socialLinks.length > 0 ? (
										member.socialLinks.map((link, index) => (
											<div key={index} className="flex items-center">
												<div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
													<GlobeAltIcon className="h-4 w-4 text-blue-400" />
												</div>
												<div>
													<p className="text-white font-medium">
														{link.platform}
													</p>
													<a
														href={link.url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-400 hover:text-blue-300 text-sm"
													>
														{link.url}
													</a>
												</div>
											</div>
										))
									) : (
										<p className="text-gray-400">No social links added</p>
									)}
								</div>
							)}
						</div>

						{/* Account Status */}
						{member.status !== 'active' && (
							<div className="bg-red-900/20 backdrop-blur-md rounded-2xl p-6 border border-red-500/30 shadow-lg">
								<h2 className="text-xl font-semibold text-white mb-4">
									Account Status
								</h2>
								<div className="space-y-3">
									<p className="text-red-300">
										Your account is currently{' '}
										<span className="font-bold uppercase">{member.status}</span>
									</p>
									{member.restriction?.reason && (
										<p className="text-red-200">
											<span className="font-medium">Reason:</span>{' '}
											{member.restriction.reason}
										</p>
									)}
									{member.restriction?.time && (
										<p className="text-red-200">
											<span className="font-medium">Review Date:</span>{' '}
											{new Date(member.restriction.time).toLocaleDateString()}
										</p>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Global Styles for Breathing Animation */}
			<style jsx global>{`
				@keyframes breathing {
					0% {
						box-shadow:
							0 0 5px rgba(59, 130, 246, 0.4),
							0 0 10px rgba(59, 130, 246, 0.3),
							0 0 15px rgba(59, 130, 246, 0.2);
					}
					50% {
						box-shadow:
							0 0 20px rgba(59, 130, 246, 0.6),
							0 0 30px rgba(59, 130, 246, 0.4),
							0 0 40px rgba(59, 130, 246, 0.3);
					}
					100% {
						box-shadow:
							0 0 5px rgba(59, 130, 246, 0.4),
							0 0 10px rgba(59, 130, 246, 0.3),
							0 0 15px rgba(59, 130, 246, 0.2);
					}
				}

				.animate-breathing {
					animation: breathing 4s ease-in-out infinite;
				}
			`}</style>
		</div>
	);
};

export default MemberProfile;
